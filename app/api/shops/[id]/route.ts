import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT: Update a shop and its ramen
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, address, ramen } = body;

        const updatedShop = await prisma.shop.update({
            where: { id },
            data: {
                name,
                address,
                ramen: {
                    deleteMany: {}, // Remove all existing ramen to re-add updated ones
                    create: ramen.map((r: any) => ({
                        name: r.name,
                        description: r.description,
                        price: r.price,
                        allergens: {
                            connect: r.allergens.map((a: any) => ({ id: a.id })), // Connect allergens by ID
                        },
                    })),
                },
            },
            include: {
                ramen: {
                    include: {
                        allergens: true, // Include allergens to get their full details
                    },
                },
            },
        });

        // Map ramen to include allergen details
        const resultWithAllergenNames = {
            ...updatedShop,
            ramen: updatedShop.ramen.map((r) => ({
                ...r,
                allergens: r.allergens.map((a) => ({
                    id: a.id,
                    name: a.name, // Ensure the name is included
                })),
            })),
        };

        return NextResponse.json(resultWithAllergenNames);
    } catch (error) {
        console.error("Error updating shop:", error);
        return NextResponse.json(
            { error: "Failed to update shop" },
            { status: 500 }
        );
    }
}


// DELETE: Delete a shop by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        await prisma.shop.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: "Shop deleted successfully" });
    } catch (error) {
        console.error("Error deleting shop:", error);
        return NextResponse.json(
            { error: "Failed to delete shop" },
            { status: 500 }
        );
    }
}
