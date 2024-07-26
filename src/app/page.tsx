// page.tsx
"use client";
import ".//styles/globals.css";
import { useState, useEffect, useRef } from "react";
import { Internship, Status } from "prisma/prisma-client";
import AddInternship from "@/components/AddInternships";
import { ChevronDown } from "lucide-react";
import { InitialInternshipData } from "@/types";
interface EditableTextProps {
    value: string;
    onSave: (value: string) => void;
}

interface EditableSelectProps {
    value: string;
    options: string[];
    onSave: (value: string) => void;
}
interface EditableDateProps {
    value: Date | null;
    onSave: (value: Date | null) => void;
}

// Editable components
const EditableText = ({ value, onSave }: EditableTextProps) => {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(value);

    const handleDoubleClick = () => setEditing(true);
    const handleBlur = () => {
        setEditing(false);
        if (text !== value) onSave(text);
    };

    if (editing) {
        return (
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                className="w-full p-1 border rounded"
            />
        );
    }
    return (
        <div
            onClick={handleDoubleClick}
            className="w-full h-full cursor-pointer"
        >
            {value}
        </div>
    );
};

const EditableSelect: React.FC<EditableSelectProps> = ({
    value,
    options,
    onSave,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setIsOpen(!isOpen);
    const handleSelect = (option: string) => {
        setIsOpen(false);
        if (option !== value) onSave(option);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full h-full" ref={dropdownRef}>
            <div
                className="flex items-center justify-between cursor-pointer w-full h-full"
                onClick={handleToggle}
            >
                <span>{value}</span>
                <ChevronDown
                    size={16}
                    className={`ml-2 transition-transform ${
                        isOpen ? "transform rotate-180" : ""
                    }`}
                />
            </div>
            {isOpen && (
                <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <li
                            key={option}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const EditableDate: React.FC<EditableDateProps> = ({ value, onSave }) => {
    const placeholder = "No Date Set";
    const [editing, setEditing] = useState(false);

    const handleDoubleClick = () => setEditing(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditing(false);
        const dateValue = e.target.value ? new Date(e.target.value) : null;
        onSave(dateValue);
    };

    const formatDate = (date: Date | null): string => {
        return date instanceof Date && !isNaN(date.getTime())
            ? date.toLocaleDateString()
            : placeholder;
    };

    if (editing) {
        return (
            <input
                type="date"
                defaultValue={
                    value instanceof Date
                        ? value.toISOString().split("T")[0]
                        : ""
                }
                onChange={handleChange}
                onBlur={() => setEditing(false)}
                autoFocus
            />
        );
    }

    return <span onDoubleClick={handleDoubleClick}>{formatDate(value)}</span>;
};

export default function Home() {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [showAddInternship, setShowAddInternship] = useState(false);

    useEffect(() => {
        // Fetch internships from API
        fetch("/api/internships")
            .then((res) => res.json())
            .then(setInternships);
    }, []);

    const handleAddInternship = async (
        newInternship: InitialInternshipData
    ) => {
        const res = await fetch("/api/internships", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newInternship),
        });
        const addedInternship = await res.json();
        setInternships((prev) => [...prev, addedInternship]);
        setShowAddInternship(false);
    };

    const toggleFavorite = (id: number) => {
        setInternships((prevInternships) =>
            prevInternships.map((internship) =>
                internship.id === id
                    ? { ...internship, isFavourite: !internship.isFavourite }
                    : internship
            )
        );
        // Update backend
        fetch(`/internships/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                isFavourite: !internships.find((i) => i.id === id)?.isFavourite,
            }),
        });
    };

    const updateInternship = async <K extends keyof Omit<Internship, "id">>(
        id: number,
        field: K,
        value: Internship[K]
    ) => {
        setInternships((prevInternships) =>
            prevInternships.map((internship) =>
                internship.id === id
                    ? { ...internship, [field]: value }
                    : internship
            )
        );

        try {
            const response = await fetch(`/api/internships/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ field, value }),
            });

            if (!response.ok) {
                throw new Error("Failed to update internship");
            }

            const updatedInternship = await response.json();
            console.log("Internship updated successfully:", updatedInternship);
        } catch (error) {
            console.error("Error updating internship:", error);
            // Here you might want to revert the optimistic update
            // or show an error message to the user
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <title>Internship Tracker</title>
            <link rel="icon" href="/favicon.ico" />
            <nav className="bg-[#ebe0ae] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl">
                                Internship Tracker
                            </span>
                        </div>
                        <div className="ml-6 flex items-center">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Internship Tracker
                    </h1>
                    <button
                        onClick={() => setShowAddInternship(!showAddInternship)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {showAddInternship ? "Cancel" : "Add Internship"}
                    </button>
                </div>

                {showAddInternship && (
                    <AddInternship onAddInternship={handleAddInternship} />
                )}

                {/* Internship Table */}
                <div className="bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 numbered-table">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Company
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Position
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Applied Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Description
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Interview
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {internships.map((internship, index) => (
                                <tr key={internship.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="cell-content">
                                            <EditableText
                                                value={internship.companyName}
                                                onSave={(value) =>
                                                    updateInternship(
                                                        internship.id,
                                                        "companyName",
                                                        value
                                                    )
                                                }
                                            />
                                            <button
                                                onClick={() =>
                                                    toggleFavorite(
                                                        internship.id
                                                    )
                                                }
                                                className="mr-2 focus:outline-none"
                                                title={
                                                    internship.isFavourite
                                                        ? "Remove from favorites"
                                                        : "Add to favorites"
                                                }
                                            >
                                                {internship.isFavourite
                                                    ? "⭐"
                                                    : "☆"}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <EditableText
                                            value={internship.position}
                                            onSave={(value) =>
                                                updateInternship(
                                                    internship.id,
                                                    "position",
                                                    value
                                                )
                                            }
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <EditableSelect
                                            value={Status[internship.status]}
                                            options={Object.keys(Status).filter(
                                                (key) => isNaN(Number(key))
                                            )}
                                            onSave={(value) =>
                                                updateInternship(
                                                    internship.id,
                                                    "status",
                                                    Status[
                                                        value as keyof typeof Status
                                                    ]
                                                )
                                            }
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <EditableDate
                                            value={internship.appliedDate}
                                            onSave={(value) =>
                                                updateInternship(
                                                    internship.id,
                                                    "appliedDate",
                                                    value
                                                )
                                            }
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs">
                                            <EditableText
                                                value={
                                                    internship.description ?? ""
                                                }
                                                onSave={(value) =>
                                                    updateInternship(
                                                        internship.id,
                                                        "description",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <EditableSelect
                                            value={
                                                internship.isInterviewing
                                                    ? "Scheduled"
                                                    : "None"
                                            }
                                            options={["None", "Scheduled"]}
                                            onSave={(value) =>
                                                updateInternship(
                                                    internship.id,
                                                    "isInterviewing",
                                                    value === "Scheduled"
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {internships.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">
                        No internships added yet.
                    </p>
                )}
            </main>
        </div>
    );
}
