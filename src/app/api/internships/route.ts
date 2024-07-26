import { NextResponse } from "next/server";
import { getInternships, createInternshipWithCompany } from "@/lib/db";

export async function GET() {
    try {
        const internships = await getInternships();
        return NextResponse.json(internships);
    } catch (error) {
        console.error("Failed to get internships:", error);
        return NextResponse.json(
            { error: "Failed to fetch internships" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const internship = await createInternshipWithCompany(data);

        return NextResponse.json(internship, { status: 201 });
    } catch (error) {
        console.error("Failed to create internship:", error);
        return NextResponse.json(
            { error: "Failed to create internship" },
            { status: 500 }
        );
    }
}
