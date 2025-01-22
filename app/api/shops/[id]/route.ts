import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT: Update a shop by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, address, ramen } = body;

        console.log("Received PUT request for shop ID:", id);
        console.log("Received data:", body);

        // Update shop information
        const updatedShop = await prisma.shop.update({
            where: { id: Number(id) },
            data: {
                name,
                address,
            },
        });
        console.log("Updated shop:", updatedShop);

        // Update ramen bowls
        if (Array.isArray(ramen)) {
            for (const ramenItem of ramen) {
                if (ramenItem.id) {
                    // Update existing ramen bowl
                    await prisma.ramen.update({
                        where: { id: ramenItem.id },
                        data: {
                            name: ramenItem.name,
                            description: ramenItem.description || null,
                            price: ramenItem.price,
                        },
                    });
                    console.log("Updated ramen:", ramenItem);
                } else {
                    // Create new ramen bowl
                    await prisma.ramen.create({
                        data: {
                            name: ramenItem.name,
                            description: ramenItem.description || null,
                            price: ramenItem.price,
                            shopId: Number(id),
                        },
                    });
                    console.log("Created new ramen:", ramenItem);
                }
            }
        }

        return NextResponse.json(body);
    } catch (error) {
        console.error("Error updating shop and ramen:", error);
        return NextResponse.json(
            { error: "Failed to update shop and ramen" },
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
