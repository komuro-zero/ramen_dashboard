import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma"; // Adjust based on your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { allergies } = req.query;

        if (!allergies) {
            return res.status(400).json({ message: "Allergies are required" });
        }

        const allergyList = (Array.isArray(allergies) ? allergies : [allergies]).map((a) => a.toLowerCase());

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

            const filteredShops = shops.map((shop) => ({
                ...shop,
                ramen: shop.ramen.filter((bowl) =>
                    !bowl.allergens.some((allergen) => allergyList.includes(allergen.name.toLowerCase()))
                ),
            })).filter((shop) => shop.ramen.length > 0); // Remove shops with no available ramen

            res.status(200).json(filteredShops);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
