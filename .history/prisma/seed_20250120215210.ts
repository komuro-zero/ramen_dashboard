import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Define ramen shops
    const shops = [
        {
            name: 'Shinbu',
            ramen: [
                { name: 'Bowl 1', allergens: ['Fish', 'Almonds and Nuts'] },
                { name: 'Bowl 2', allergens: ['Fish'] },
                { name: 'Bowl 3', allergens: ['Fish'] },
                { name: 'Vegan Bowl', allergens: [] },
            ],
        },
        {
            name: 'Mensho',
            ramen: [
                { name: 'Tori Paitan', allergens: ['Almonds and Nuts', 'Milk'] },
                { name: 'Matcha Paitan', allergens: ['Almonds and Nuts', 'Milk'] },
                { name: 'Vegan Tantanmen (Soupless)', allergens: [] },
                { name: 'Vegan Tantanmen (With Soup)', allergens: [] },
            ],
        },
        {
            name: 'Ecchan',
            ramen: [
                { name: 'Curry Ramen', allergens: ['Egg', 'Milk'] },
                { name: 'Abura Soba', allergens: ['Egg'] },
                { name: 'Spicy Miso', allergens: ['Milk'] },
            ],
        },
        {
            name: 'Shuichi',
            ramen: [
                { name: 'Chuukasoba', allergens: ['Beef', 'Fish'] },
                { name: 'Tantanmen', allergens: ['Milk', 'Shellfish'] },
                { name: 'Spicy Miso', allergens: ['Fish'] },
                { name: 'Abura Soba', allergens: [] },
            ],
        },
        {
            name: 'Tomo',
            ramen: [
                { name: 'Truffle Chicken Chuukasoba', allergens: ['Milk', 'Shellfish'] },
                { name: 'Cheese Maze Soba', allergens: ['Milk', 'Shellfish'] },
                { name: 'Shio Chuukasoba', allergens: ['Fish'] },
                { name: 'Tsukesoba', allergens: ['Fish'] },
            ],
        },
    ];

    // Insert shops and ramen into the database
    for (const shop of shops) {
        const createdShop = await prisma.shop.create({
            data: {
                name: shop.name,
                ramen: {
                    create: shop.ramen.map((bowl) => ({
                        name: bowl.name,
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

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
