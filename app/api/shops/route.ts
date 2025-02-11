import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all shops along with ramen and allergens
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
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, address, ramen } = body;

        const newShop = await prisma.shop.create({
            data: {
                name,
                address,
                ramen: {
                    create: ramen.map((r: any) => ({
                        name: r.name,
                        description: r.description,
                        price: r.price,
                        allergens: {
                            connect: r.allergens.map((a: any) => ({ id: a.id })),
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

        return NextResponse.json(newShop);
    } catch (error) {
        console.error("Error creating shop:", error);
        return NextResponse.json(
            { error: "Failed to create shop" },
            { status: 500 }
        );
    }
}

// PUT: Update a shop and its ramen
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, address, ramen } = body;

        const updatedShop = await prisma.shop.update({
            where: { id },
            data: {
                name,
                address,
                ramen: {
                    deleteMany: {}, // Remove all ramen to re-add updated ones
                    create: ramen.map((r: any) => ({
                        name: r.name,
                        description: r.description,
                        price: r.price,
                        allergens: {
                            connect: r.allergens.map((a: any) => ({ id: a.id })),
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

        return NextResponse.json(updatedShop);
    } catch (error) {
        console.error("Error updating shop:", error);
        return NextResponse.json(
            { error: "Failed to update shop" },
            { status: 500 }
        );
    }
}

// DELETE: Delete a shop
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;


        // Validate ID
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        console.log("Received DELETE request for shop with id:", id);

        // Convert to number if needed
        const shopId = parseInt(id, 10);
        console.log("Converted ID to number:", shopId);
        await prisma.shop.delete({
            where: { id: shopId },
        });
        console.log("Shop deleted successfully");
        return NextResponse.json({ message: "Shop deleted successfully" });
    } catch (error) {
        console.error("Error deleting shop:", error);
        return NextResponse.json(
            { error: "Failed to delete shop" },
            { status: 500 }
        );
    }
}
