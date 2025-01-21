import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Define ramen shops
    const shops = [
        {
            name: 'Shinbu',
            address: '123 Shinbu St, Tokyo',
            ramen: [
                { name: 'Bowl 1', price: 1000, allergens: ['Fish', 'Almonds and Nuts'] },
                { name: 'Bowl 2', price: 950, allergens: ['Fish'] },
                { name: 'Bowl 3', price: 1100, allergens: ['Fish'] },
                { name: 'Vegan Bowl', price: 1200, allergens: [] },
            ],
        },
        {
            name: 'Mensho',
            address: '456 Mensho Ave, Tokyo',
            ramen: [
                { name: 'Tori Paitan', price: 1300, allergens: ['Almonds and Nuts', 'Milk'] },
                { name: 'Matcha Paitan', price: 1250, allergens: ['Almonds and Nuts', 'Milk'] },
                { name: 'Vegan Tantanmen (Soupless)', price: 1150, allergens: [] },
                { name: 'Vegan Tantanmen (With Soup)', price: 1150, allergens: [] },
            ],
        },
        {
            name: 'Ecchan',
            address: '789 Ecchan Rd, Tokyo',
            ramen: [
                { name: 'Curry Ramen', price: 1000, allergens: ['Egg', 'Milk'] },
                { name: 'Abura Soba', price: 900, allergens: ['Egg'] },
                { name: 'Spicy Miso', price: 950, allergens: ['Milk'] },
            ],
        },
        {
            name: 'Shuichi',
            address: '101 Shuichi Blvd, Tokyo',
            ramen: [
                { name: 'Chuukasoba', price: 950, allergens: ['Beef', 'Fish'] },
                { name: 'Tantanmen', price: 1100, allergens: ['Milk', 'Shellfish'] },
                { name: 'Spicy Miso', price: 1000, allergens: ['Fish'] },
                { name: 'Abura Soba', price: 850, allergens: [] },
            ],
        },
        {
            name: 'Tomo',
            address: '202 Tomo St, Tokyo',
            ramen: [
                { name: 'Truffle Chicken Chuukasoba', price: 1500, allergens: ['Milk', 'Shellfish'] },
                { name: 'Cheese Maze Soba', price: 1400, allergens: ['Milk', 'Shellfish'] },
                { name: 'Shio Chuukasoba', price: 1000, allergens: ['Fish'] },
                { name: 'Tsukesoba', price: 1200, allergens: ['Fish'] },
            ],
        },
    ];

    // Insert shops and ramen into the database
    for (const shop of shops) {
        const createdShop = await prisma.shop.create({
            data: {
                name: shop.name,
                address: shop.address, // Address field added
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
