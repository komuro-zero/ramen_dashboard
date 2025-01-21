"use client"
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Restaurants</h1>

      <div className="mb-4">
        <h2 className="font-semibold">Select Allergies:</h2>
        <div className="flex flex-wrap gap-2">
          {allergyOptions.map((allergy) => (
            <label key={allergy} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={allergy}
                checked={allergies.includes(allergy)}
                onChange={() => toggleAllergy(allergy)}
              />
              {allergy}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={fetchResults}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Search
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Results:</h2>
        {results.length > 0 ? (
          <ul>
            {results.map((shop) => (
              <li key={shop.id} className="mb-4">
                <h3 className="font-bold text-lg">{shop.name}</h3>
                <p>{shop.address}</p>
                <ul>
                  {shop.ramen.map((bowl) => (
                    <li
                      key={bowl.id}
                      className={`${bowl.allergens.length > 0 ? "text-red-500" : "text-green-500"
                        }`}
                    >
                      {bowl.name} {bowl.allergens.length > 0 && "(Avoid due to allergens)"}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found. Try removing some allergy filters.</p>
        )}
      </div>
    </div>
  );
}
