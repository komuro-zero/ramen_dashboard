"use client";

import { useState } from "react";

export default function ManageBowls() {
    const [bowls, setBowls] = useState([
        { id: 1, name: "Tori Paitan", allergens: ["Milk", "Almonds and Nuts"] },
        { id: 2, name: "Vegan Tantanmen", allergens: [] },
    ]);

    const deleteBowl = (id: number) => {
        setBowls((prev) => prev.filter((bowl) => bowl.id !== id));
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Bowls</h1>
            <button className="px-4 py-2 bg-blue-600 text-white rounded mb-4">
                Add Bowl
            </button>
            <ul>
                {bowls.map((bowl) => (
                    <li
                        key={bowl.id}
                        className="flex justify-between items-center p-4 mb-2 bg-white rounded shadow"
                    >
                        <div>
                            <h2 className="font-semibold">{bowl.name}</h2>
                            <p>
                                Allergens:{" "}
                                {bowl.allergens.length > 0
                                    ? bowl.allergens.join(", ")
                                    : "No allergens"}
                            </p>
                        </div>
                        <div>
                            <button className="px-3 py-1 bg-yellow-500 text-white rounded mr-2">
                                Edit
                            </button>
                            <button
                                onClick={() => deleteBowl(bowl.id)}
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
