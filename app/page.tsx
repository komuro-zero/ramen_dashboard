"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { LoadingModal } from "@/components/LoadingModal";
import { LoadingNoodles } from "@/components/LoadingRamen";


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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [allergenRes, shopRes] = await Promise.all([
          fetch(`/api/allergens`),
          fetch(`/api/search`),
        ]);
        const allergens = await allergenRes.json();
        const shops = await shopRes.json();
        setAllergyOptions(allergens);
        setResults(shops);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const isShopUnavailable = (ramenBowls: Ramen[]) => {
    return ramenBowls.every((bowl) =>
      bowl.allergens.some((allergen) => allergies.includes(allergen.name))
    );
  };

  if (loading) {
    return <LoadingNoodles />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Search Restaurants</h1>
      {/* Allergen Selection */}
      <div className="mb-6 p-4 bg-blue-100 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2 text-blue-900">Select Allergies:</h2>
        <div className="flex flex-wrap gap-4">
          {allergyOptions.map((allergen) => (
            <button
              key={allergen.id}
              onClick={() => toggleAllergy(allergen.name)}
              className={`px-4 py-2 rounded-lg cursor-pointer border-2 border-blue-500 text-blue-900 font-semibold 
              ${allergies.includes(allergen.name) ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-500 hover:text-white"}`}
            >
              {allergen.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section with Framer Motion */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Results:</h2>
        {results.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {results.map((shop, index) => {
              const unavailable = isShopUnavailable(shop.ramen);
              return (
                <motion.div
                  key={shop.id}
                  className={`border rounded-lg shadow-md p-4 bg-white ${unavailable ? "opacity-50" : ""}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <h3 className="text-lg font-bold mb-2">{shop.name} {unavailable && "🚫"}</h3>
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
                          <div className="text-sm">Allergens: {bowl.allergens.map((a) => a.name).join(", ")}</div>
                        ) : (
                          <div className="text-sm">No allergens 🎉</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <p className="text-gray-500">No results found. Try removing some allergy filters.</p>
        )}
      </div>
    </div>
  );
}