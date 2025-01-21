import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const allergens = await prisma.allergen.findMany();
        return NextResponse.json(allergens);
    } catch (error) {
        console.error("Error fetching allergens:", error);
        return NextResponse.json({ error: "Failed to fetch allergens" }, { status: 500 });
    }
}
