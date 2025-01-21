"use client";

import { useEffect, useState } from "react";

interface Shop {
    id: number;
    name: string;
    address: string;
    allergens: number[]; // Array of allergen IDs
}

interface Allergen {
    id: number;
    name: string;
}

export default function ManageShops() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editShop, setEditShop] = useState<Shop | null>(null);
    const [allergens, setAllergens] = useState<Allergen[]>([]);

    // Fetch shops and allergens from the database
    useEffect(() => {
        async function fetchData() {
            const shopRes = await fetch("/api/shops");
            const allergenRes = await fetch("/api/allergens");
            setShops(await shopRes.json());
            setAllergens(await allergenRes.json());
        }
        fetchData();
    }, []);

    const handleSave = async (shop: Shop) => {
        const allergensSelected = Array.from(
            document.querySelectorAll<HTMLInputElement>("input[name='allergens']:checked")
        ).map((input) => Number(input.value));

        const updatedShop = { ...shop, allergens: allergensSelected };

        if (editShop) {
            // Update shop
            await fetch(`/api/shops/${editShop.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedShop),
            });
            setShops((prev) =>
                prev.map((s) => (s.id === editShop.id ? { ...s, ...updatedShop } : s))
            );
        } else {
            // Add new shop
            const res = await fetch("/api/shops", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedShop),
            });
            const newShop = await res.json();
            setShops((prev) => [...prev, newShop]);
        }
        setIsModalOpen(false);
        setEditShop(null);
    };

    const handleDelete = async (id: number) => {
        const confirm = window.confirm("Are you sure you want to delete this shop?");
        if (confirm) {
            await fetch(`/api/shops/${id}`, { method: "DELETE" });
            setShops((prev) => prev.filter((shop) => shop.id !== id));
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Shops</h1>
            <button
                onClick={() => {
                    setEditShop(null);
                    setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
            >
                Add Shop
            </button>
            <ul>
                {shops.map((shop) => (
                    <li
                        key={shop.id}
                        className="flex justify-between items-center p-4 mb-2 bg-white rounded shadow"
                    >
                        <div>
                            <h2 className="font-semibold">{shop.name}</h2>
                            <p>{shop.address}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setEditShop(shop);
                                    setIsModalOpen(true);
                                }}
                                className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(shop.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">
                            {editShop ? "Edit Shop" : "Add Shop"}
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                                const address = (form.elements.namedItem("address") as HTMLInputElement).value;
                                handleSave({ id: editShop?.id || 0, name, address, allergens: [] });
                            }}
                        >
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Shop Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={editShop?.name || ""}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    defaultValue={editShop?.address || ""}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Allergens</label>
                                <ul className="grid grid-cols-2 gap-2">
                                    {allergens.map((allergen) => (
                                        <li key={allergen.id} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="allergens"
                                                value={allergen.id}
                                                defaultChecked={editShop?.allergens.includes(allergen.id)}
                                            />
                                            <span>{allergen.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditShop(null);
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
