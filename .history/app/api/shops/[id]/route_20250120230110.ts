import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT: Update a shop by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { name, address } = body;

        const updatedShop = await prisma.shop.update({
            where: { id: Number(id) },
            data: {
                name,
                address,
            },
        });

        return NextResponse.json(updatedShop);
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
