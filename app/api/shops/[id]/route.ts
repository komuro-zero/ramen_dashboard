import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Allergen = {
    id: string;
    name: string;
};

type Ramen = {
    id: string;
    name: string;
    description: string;
    price: number;
    allergens: Allergen[];
};



// PUT: Update a shop and its ramen
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, address, ramen }: { id: string; name: string; address: string; ramen: Ramen[] } = body;

        const updatedShop = await prisma.shop.update({
            where: { id: Number(id) },
            data: {
                name,
                address,
                ramen: {
                    deleteMany: {}, // Remove all existing ramen
                    create: ramen.map((r: any) => ({
                        name: r.name,
                        description: r.description,
                        price: r.price,
                        allergens: {
                            connect: r.allergens
                                ?.filter((a: any) => a.id) // Filter allergens with valid IDs
                                .map((a: any) => ({ id: a.id })),
                        },
                    })),
                },
            },
            include: {
                ramen: {
                    include: {
                        allergens: true,
                    },
                },
            },
        });

        const resultWithAllergenNames = {
            ...updatedShop,
            ramen: updatedShop.ramen.map((r) => ({
                ...r,
                allergens: r.allergens.map((a) => ({
                    id: a.id,
                    name: a.name,
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
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> } // Ensure `context.params` is correctly typed
): Promise<Response> {
    try {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await prisma.shop.delete({
            where: { id: Number(id) }, // Convert `id` to a number if necessary
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