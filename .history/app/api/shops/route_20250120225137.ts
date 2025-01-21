import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
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
        return NextResponse.json({ error: "Failed to fetch shops" }, { status: 500 });
    }
}
