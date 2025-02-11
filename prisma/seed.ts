const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const shops = [
        {
            name: "Shinbu Sakiya",
            address: "123 Shinbu St, Tokyo",
            ramen: [
                { name: "Shoyu", price: 1000, allergens: ["Fish", "Pork", "Chicken", "Fish"] },
                { name: "Shio", price: 1000, allergens: ["Fish", "Pork", "Chicken", "Fish"] },
                { name: "Miso", price: 1000, allergens: ["Fish", "Pork", "Chicken", "Fish", "Almonds and Nuts"] },
                { name: "Spicy Miso", price: 1100, allergens: ["Fish", "Pork", "Chicken", "Fish", "Almonds and Nuts"] },
                { name: "Vegan Shoyu", price: 1200, allergens: [] },
                { name: "Vegan Shio", price: 1200, allergens: [] },
                { name: "Vegan Miso", price: 1200, allergens: [] },
                { name: "Vegan Spicy Miso", price: 1300, allergens: [] },
            ],
        },
        {
            name: "Nagi Butao",
            address: "456 Nagi St, Tokyo",
            ramen: [
                { name: "Original King", price: 1000, allergens: ["Pork", "Shellfish", "Egg"] },
                { name: "Red King", price: 1000, allergens: ["Pork", "Egg"] },
                { name: "Green King", price: 1100, allergens: ["Pork", "Shellfish", "Egg"] },
                { name: "Black King", price: 1200, allergens: ["Pork", "Egg"] },
            ],
        },
        {
            name: "Shuichi",
            address: "789 Shuichi Rd, Tokyo",
            ramen: [
                { name: "Curry Ramen", price: 1000, allergens: ["Beef", "Pork", "Chicken", "Milk", "Shellfish"] },
                { name: "Curry Abura Soba", price: 950, allergens: ["Beef", "Pork", "Chicken", "Shellfish", "Fish"] },
                { name: "Black Sesame Tantanmen", price: 1100, allergens: ["Beef", "Pork", "Chicken", "Milk", "Shellfish", "Fish"] },
                { name: "Spicy Miso", price: 1050, allergens: ["Beef", "Pork", "Chicken", "Milk", "Shellfish"] },
            ],
        },
        {
            name: "Ecchan",
            address: "101 Ecchan Blvd, Tokyo",
            ramen: [
                { name: "Chuuka Soba", price: 950, allergens: ["Pork", "Chicken"] },
                { name: "Karami Chuuka", price: 1000, allergens: ["Pork", "Chicken"] },
                { name: "Mori Soba", price: 1050, allergens: ["Pork", "Chicken"] },
            ],
        },
        {
            name: "Mensho",
            address: "Tokyo",
            ramen: [
                { name: "Shio Chuukasoba", price: 1200, allergens: ["Pork", "Shellfish"] },
                { name: "Tori Paitan", price: 1300, allergens: ["Chicken", "Almonds and Nuts"] },
                { name: "Matcha Paitan", price: 1350, allergens: ["Chicken", "Almonds and Nuts"] },
                { name: "Wagyu Tantanmen", price: 1400, allergens: ["Pork", "Shellfish", "Almonds and Nuts"] },
                { name: "Vegan Tantanmen", price: 1200, allergens: ["Almonds and Nuts"] },
                { name: "Vegan Soupless Tantanmen", price: 1150, allergens: ["Almonds and Nuts"] },
            ],
        },
        {
            name: "Tomo Premium",
            address: "202 Tomo St, Tokyo",
            ramen: [
                { name: "Flying Fish Chuukasoba", price: 1300, allergens: ["Pork", "Beef", "Chicken", "Fish", "Egg"] },
                { name: "Truffle Chicken Chuukasoba", price: 1500, allergens: ["Pork", "Beef", "Chicken", "Shellfish", "Fish", "Egg"] },
                { name: "Flying Fish Tsukesoba", price: 1350, allergens: ["Pork", "Beef", "Chicken", "Fish", "Egg"] },
                { name: "Pecorino Romano Maze Soba", price: 1400, allergens: ["Pork", "Chicken", "Shellfish", "Fish", "Egg"] },
            ],
        },
        {
            name: "Atariya Shokudo",
            address: "Osaka",
            ramen: [
                { name: "Champon", price: 1450, allergens: ["Pork", "Chicken", "Shellfish", "Fish"] },
                { name: "Spicy Champon", price: 1500, allergens: ["Pork", "Chicken", "Shellfish", "Fish"] },
                { name: "Ramen", price: 1300, allergens: ["Egg", "Chicken"] },
                { name: "Rairaimen", price: 1200, allergens: ["Pork", "Chicken"] },
            ],
        },
        {
            name: "Aidaya",
            address: "Nagoya",
            ramen: [
                { name: "Tonkotsu Gyoukai", price: 1250, allergens: ["Pork", "Fish"] },
                { name: "Shrimp Ramen", price: 1300, allergens: ["Pork", "Shellfish", "Fish"] },
                { name: "Garlic Shoyu", price: 1100, allergens: ["Pork", "Fish"] },
                { name: "Tantanmen", price: 1200, allergens: ["Pork", "Fish"] },
            ],
        },
        {
            name: "Kakashi",
            address: "Tokyo",
            ramen: [
                { name: "Tori Chintan Shio", price: 1000, allergens: ["Chicken", "Shellfish", "Fish"] },
                { name: "Tori Chintan Shoyu", price: 1050, allergens: ["Chicken", "Fish"] },
                { name: "Tantanmen", price: 1100, allergens: ["Chicken", "Shellfish", "Fish"] },
                { name: "Tori Paitan Shio", price: 1150, allergens: ["Chicken", "Shellfish", "Fish"] },
            ],
        },
        {
            name: "Inose",
            address: "Osaka",
            ramen: [
                { name: "The Default", price: 1100, allergens: ["Pork", "Chicken", "Shellfish", "Fish"] },
                { name: "Tokyo Classic", price: 1150, allergens: ["Pork", "Chicken", "Fish"] },
                { name: "Mushroom Daikon", price: 1200, allergens: ["Pork", "Chicken", "Fish"] },
                { name: "Cold Soy Milk Tantan", price: 1300, allergens: ["Pork", "Chicken", "Fish"] },
            ],
        },
    ];

    // Insert shops and ramen into the database
    for (const shop of shops) {
        const createdShop = await prisma.shop.create({
            data: {
                name: shop.name,
                address: shop.address,
                ramen: {
                    create: shop.ramen.map((bowl) => ({
                        name: bowl.name,
                        price: bowl.price,
                        allergens: {
                            connectOrCreate: bowl.allergens.map((allergen) => ({
                                where: { name: allergen },
                                create: { name: allergen },
                            })),
                        },
                    })),
                },
            },
        });

        console.log(`Created shop: ${createdShop.name}`);
    }

    console.log("Seeding completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
