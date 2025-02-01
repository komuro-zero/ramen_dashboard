"use client";

import { useState, useEffect } from "react";

// Define types
type Allergen = {
  id: string;
  name: string;
};

type Ramen = {
  id: string;
  name: string;
  allergens: Allergen[];
};

type Shop = {
  id: string;
  name: string;
  address: string;
  ramen: Ramen[];
};

type AllergyOption = {
  id: string;
  name: string;
};

export default function SearchPage() {
  const [allergies, setAllergies] = useState<string[]>([]);
  const [results, setResults] = useState<Shop[]>([]);
  const [allergyOptions, setAllergyOptions] = useState<AllergyOption[]>([]);
  const [loadingAllergens, setLoadingAllergens] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  // Fetch Allergens
  useEffect(() => {
    async function fetchAllergens() {
      try {
        const response = await fetch(`/api/allergens`);
        const data = await response.json();
        setAllergyOptions(data);
      } catch (error) {
        console.error("Error fetching allergens:", error);
      } finally {
        setLoadingAllergens(false);
      }
    }
    fetchAllergens();
  }, []);

  const toggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const fetchResults = async () => {
    setLoadingResults(true);
    try {
      const response = await fetch(`/api/search?allergies=${allergies.join(",")}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoadingResults(false);
    }
  };

  const isShopUnavailable = (ramenBowls: Ramen[]) => {
    return ramenBowls.every((bowl) =>
      bowl.allergens.some((allergen) => allergies.includes(allergen.name))
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Search Restaurants</h1>

      {/* Allergen Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Select Allergies:</h2>
        <div className="flex flex-wrap gap-4">
          {loadingAllergens ? (
            // Skeleton Loader for Allergens
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="w-24 h-8 bg-gray-300 rounded-lg animate-pulse"
              ></div>
            ))
          ) : (
            allergyOptions.map((allergen) => (
              <button
                key={allergen.id}
                onClick={() => toggleAllergy(allergen.name)}
                className={`px-3 py-1 rounded-lg cursor-pointer 
                ${allergies.includes(allergen.name) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}
                hover:bg-blue-500 hover:text-white`}
              >
                {allergen.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={fetchResults}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Search
      </button>

      {/* Loading Modal */}
      {loadingResults && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-12 h-12 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">Loading results...</p>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Results:</h2>
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((shop) => {
              const unavailable = isShopUnavailable(shop.ramen);
              return (
                <div
                  key={shop.id}
                  className={`border rounded-lg shadow-md p-4 bg-white ${unavailable ? "opacity-50" : ""}`}
                >
                  <h3 className="text-lg font-bold mb-2">
                    {shop.name} {unavailable && "🚫"}
                  </h3>
                  <p className="text-gray-500 mb-4">{shop.address}</p>
                  <h4 className="text-md font-semibold mb-2">Ramen Bowls:</h4>
                  <ul className="space-y-2">
                    {shop.ramen.map((bowl) => (
                      <li
                        key={bowl.id}
                        className={`p-2 rounded-lg ${bowl.allergens.some((allergen) => allergies.includes(allergen.name))
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                          }`}
                      >
                        <div className="font-medium">{bowl.name}</div>
                        {bowl.allergens.length > 0 ? (
                          <div className="text-sm">
                            Allergens: {bowl.allergens.map((a) => a.name).join(", ")}
                          </div>
                        ) : (
                          <div className="text-sm">No allergens 🎉</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No results found. Try removing some allergy filters.</p>
        )}
      </div>
    </div>
  );
}
