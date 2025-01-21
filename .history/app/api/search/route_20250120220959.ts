import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust this path to where your shared prisma instance is located

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const allergies = url.searchParams.getAll("allergies");

        if (allergies.length === 0) {
            return NextResponse.json({ message: "Allergies are required" }, { status: 400 });
        }

        const allergyList = allergies.map((a) => a.toLowerCase());

        const shops = await prisma.shop.findMany({
            include: {
                ramen: {
                    include: {
                        allergens: true,
                    },
                },
            },
        });

        const filteredShops = shops
            .map((shop) => ({
                ...shop,
                ramen: shop.ramen.filter((bowl) =>
                    !bowl.allergens.some((allergen) => allergyList.includes(allergen.name.toLowerCase()))
                ),
            }))
            .filter((shop) => shop.ramen.length > 0); // Remove shops with no available ramen

        return NextResponse.json(filteredShops);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
