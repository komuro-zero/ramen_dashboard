"use client";

import { useState } from "react";

export default function ManageAllergens() {
    const [allergens, setAllergens] = useState(["Fish", "Milk", "Egg", "Shellfish"]);

    const deleteAllergen = (name: string) => {
        setAllergens((prev) => prev.filter((allergen) => allergen !== name));
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Allergens</h1>
            <button className="px-4 py-2 bg-blue-600 text-white rounded mb-4">
                Add Allergen
            </button>
            <ul>
                {allergens.map((allergen, index) => (
                    <li
                        key={index}
                        className="flex justify-between items-center p-4 mb-2 bg-white rounded shadow"
                    >
                        <span>{allergen}</span>
                        <button
                            onClick={() => deleteAllergen(allergen)}
                            className="px-3 py-1 bg-red-600 text-white rounded"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
