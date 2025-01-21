"use client";

import { useState } from "react";

export default function ManageShops() {
    const [shops, setShops] = useState([
        { id: 1, name: "Shinbu", address: "123 Shinbu St, Tokyo" },
        { id: 2, name: "Mensho", address: "456 Mensho Ave, Tokyo" },
    ]);

    const deleteShop = (id: number) => {
        setShops((prev) => prev.filter((shop) => shop.id !== id));
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Shops</h1>
            <button className="px-4 py-2 bg-blue-600 text-white rounded mb-4">
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
                            <button className="px-3 py-1 bg-yellow-500 text-white rounded mr-2">
                                Edit
                            </button>
                            <button
                                onClick={() => deleteShop(shop.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
