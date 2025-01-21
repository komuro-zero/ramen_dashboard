import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const allergies = searchParams.get('allergies')?.split(',') || [];

    try {
        const shops = await prisma.shop.findMany({
            include: {
                ramen: {
                    include: {
                        allergens: true,
                    },
                },
            },
            where: {
                // Exclude shops where ALL ramen bowls have ANY of the selected allergies
                NOT: {
                    ramen: {
                        every: {
                            allergens: {
                                some: {
                                    name: {
                                        in: allergies,
                                    },
                                },
                            },
                        },
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