import { Internship, Status } from ".prisma/client";
import { InitialInternshipData } from "@/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getInternships() {
    return prisma.internship.findMany();
}
export async function updateInternship<K extends keyof Omit<Internship, "id">>(
    id: number,
    field: K,
    value: Internship[K]
) {
    return prisma.internship.update({
        where: { id },
        data: { [field]: value },
    });
}
export async function createInternshipWithCompany(
    data: InitialInternshipData,
    userId: number = 1
) {
    console.log("Creating internship with company:", data.companyName);
    return prisma
        .$transaction(async (tx) => {
            console.log("inside transaction");
            // 1. Find or create the company
            let company = await tx.company.findUnique({
                where: { name: data.companyName },
            });

            if (!company) {
                company = await tx.company.create({
                    data: {
                        name: data.companyName,
                        website: data.companyWebsite,
                    },
                });
            }

            // 2. Create the internship
            const internship = await tx.internship.create({
                data: {
                    ...data,
                    companyId: company.id,
                    userId: userId,
                },
            });

            return internship;
        })
        .then((result) => {
            console.log("Transaction committed successfully");
            return result;
        })
        .catch((error) => {
            console.error("Transaction failed:", error);
            throw error;
        });
}
export async function testDatabaseConnection() {
    try {
        await prisma.$connect();
        console.log("Database connection successful");
        const internshipCount = await prisma.internship.count();
        console.log(`Current internship count: ${internshipCount}`);
    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}
