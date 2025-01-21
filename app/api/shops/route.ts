import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all shops
export async function GET() {
    try {
        const shops = await prisma.shop.findMany({
            include: {
                ramen: {
                    include: {
                        allergens: true,
                    },
                },
            },
        });
        return NextResponse.json(shops);
    } catch (error) {
        console.error("Error fetching shops:", error);
        return NextResponse.json(
            { error: "Failed to fetch shops" },
            { status: 500 }
        );
    }
}

// POST: Create a new shop
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, address } = body;

        const newShop = await prisma.shop.create({
            data: {
                name,
                address,
            },
        });

        return NextResponse.json(newShop);
    } catch (error) {
        console.error("Error creating shop:", error);
        return NextResponse.json(
            { error: "Failed to create shop" },
            { status: 500 }
        );
    }
}
