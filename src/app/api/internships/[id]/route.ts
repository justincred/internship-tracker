import { NextResponse, NextRequest } from "next/server";
import { updateInternship } from "@/lib/db";
import { Internship } from ".prisma/client";
type UpdateInternshipPayload = {
    field: keyof Omit<Internship, "id">;
    value: Internship[keyof Omit<Internship, "id">];
};
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json(
                { error: "Invalid internship ID" },
                { status: 400 }
            );
        }

        const data: UpdateInternshipPayload = await request.json();
        const { field, value } = data;

        const updatedInternship = await updateInternship(id, field, value);

        if (!updatedInternship) {
            return NextResponse.json(
                { error: "Internship not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedInternship);
    } catch (error) {
        console.error("Failed to update internship:", error);
        return NextResponse.json(
            { error: "Failed to update internship" },
            { status: 500 }
        );
    }
}
