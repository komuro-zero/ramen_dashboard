import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all allergens
export async function GET() {
    try {
        const allergens = await prisma.allergen.findMany();
        return NextResponse.json(allergens);
    } catch (error) {
        console.error("Error fetching allergens:", error);
        return NextResponse.json({ error: "Failed to fetch allergens" }, { status: 500 });
    }
}

// POST: Add a new allergen
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        const newAllergen = await prisma.allergen.create({
            data: { name },
        });

        return NextResponse.json(newAllergen);
    } catch (error) {
        console.error("Error adding allergen:", error);
        return NextResponse.json({ error: "Failed to add allergen" }, { status: 500 });
    }
}

// PUT: Update an allergen
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name } = body;

        const updatedAllergen = await prisma.allergen.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(updatedAllergen);
    } catch (error) {
        console.error("Error updating allergen:", error);
        return NextResponse.json({ error: "Failed to update allergen" }, { status: 500 });
    }
}

// DELETE: Delete an allergen
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        await prisma.allergen.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Allergen deleted successfully" });
    } catch (error) {
        console.error("Error deleting allergen:", error);
        return NextResponse.json({ error: "Failed to delete allergen" }, { status: 500 });
    }
}
