"use client";

import { useState } from "react";

export default function SearchPage() {
  const [allergies, setAllergies] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);

  const allergyOptions = ["Fish", "Milk", "Shellfish", "Egg", "Almonds and Nuts"];

  const toggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/search?allergies=${allergies.join(",")}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Search Restaurants</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Select Allergies:</h2>
        <div className="flex flex-wrap gap-4">
          {allergyOptions.map((allergy) => (
            <button
              key={allergy}
              onClick={() => toggleAllergy(allergy)}
              className={`px-3 py-1 rounded-lg cursor-pointer 
                ${allergies.includes(allergy)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }
                hover:bg-blue-500 hover:text-white`}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={fetchResults}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Search
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Results:</h2>
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((shop) => (
              <div
                key={shop.id}
                className="border rounded-lg shadow-md p-4 bg-white"
              >
                <h3 className="text-lg font-bold mb-2">{shop.name}</h3>
                <p className="text-gray-500 mb-4">{shop.address}</p>
                <h4 className="text-md font-semibold mb-2">Ramen Bowls:</h4>
                <ul className="space-y-2">
                  {shop.ramen.map((bowl) => (
                    <li
                      key={bowl.id}
                      className={`p-2 rounded-lg ${bowl.allergens.length > 0
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                        }`}
                    >
                      <div className="font-medium">{bowl.name}</div>
                      {bowl.allergens.length > 0 && (
                        <div className="text-sm">
                          Allergens: {bowl.allergens.map((a) => a.name).join(", ")}
                        </div>
                      )}
                      {bowl.allergens.length === 0 && (
                        <div className="text-sm">No allergens 🎉</div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No results found. Try removing some allergy filters.</p>
        )}
      </div>
    </div>
  );
}
