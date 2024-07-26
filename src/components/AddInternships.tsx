"use client";
import { useState } from "react";
import { Internship, Status } from "prisma/prisma-client";
import { Decimal } from "@prisma/client/runtime/library";
import { InitialInternshipData } from "@/types";

interface AddInternshipProps {
    onAddInternship: (internship: InitialInternshipData) => void;
}

export default function AddInternship({ onAddInternship }: AddInternshipProps) {
    const [newInternship, setNewInternship] = useState<InitialInternshipData>({
        companyName: "", // Required field, start with empty string
        companyWebsite: null, // Optional, use null
        position: "", // Required field, start with empty string
        description: null, // Optional, use null
        status: Status.YetToApply,
        appliedDate: null,
        deadline: null, // Optional, use null
        salary: null, // Optional, use null
        location: null, // Optional, use null
        notes: null, // Optional, use null
        isFavourite: false,
        isInterviewing: false,
    });

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;
        setNewInternship((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : name === "appliedDate" || name === "deadline"
                    ? value
                        ? new Date(value).toISOString()
                        : null
                    : name === "salary"
                    ? value
                        ? parseFloat(value)
                        : null
                    : value || null,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onAddInternship(newInternship);
        setNewInternship({
            companyName: "", // Required field, start with empty string
            companyWebsite: null, // Optional, use null
            position: "", // Required field, start with empty string
            description: null, // Optional, use null
            status: Status.YetToApply,
            appliedDate: null,
            deadline: null, // Optional, use null
            salary: null, // Optional, use null
            location: null, // Optional, use null
            notes: null, // Optional, use null
            isFavourite: false,
            isInterviewing: false,
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Add New Internship</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="companyName"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Company Name
                    </label>
                    <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={newInternship.companyName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="companyWebsite"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Company Website (optional)
                    </label>
                    <input
                        type="text"
                        id="companyWebsite"
                        name="companyWebsite"
                        value={newInternship.companyWebsite || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="position"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Position
                    </label>
                    <input
                        type="text"
                        id="position"
                        name="position"
                        value={newInternship.position}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="jobDescription"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Job Description
                    </label>
                    <textarea
                        id="jobDescription"
                        name="description"
                        value={newInternship.description || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        rows={3}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={newInternship.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        {Object.entries(Status)
                            .filter(([key]) => isNaN(Number(key)))
                            .map(([key, value]) => (
                                <option key={key} value={value}>
                                    {key}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="appliedDate"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Applied Date
                    </label>
                    <input
                        type="date"
                        id="appliedDate"
                        name="appliedDate"
                        value={
                            newInternship.appliedDate
                                ? new Date(newInternship.appliedDate)
                                      .toISOString()
                                      .split("T")[0]
                                : ""
                        }
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="isFavourite"
                            checked={newInternship.isFavourite}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Favorite
                        </span>
                    </label>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add Internship
                </button>
            </form>
        </div>
    );
}
