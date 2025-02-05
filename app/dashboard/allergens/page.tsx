"use client";

import { useEffect, useState } from "react";
import { LoadingModal } from "@/components/LoadingModal";
import { motion } from "framer-motion";

interface Allergen {
  id: number;
  name: string;
}

export default function ManageAllergens() {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editAllergen, setEditAllergen] = useState<Allergen | null>(null);
  const [newAllergenName, setNewAllergenName] = useState("");

  useEffect(() => {
    // Fetch allergens from the API
    async function fetchAllergens() {
      const response = await fetch("/api/allergens");
      const data = await response.json();
      setAllergens(data);
    }
    fetchAllergens();
  }, []);

  const handleAddAllergen = async () => {
    if (!newAllergenName.trim()) return;

    const response = await fetch("/api/allergens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newAllergenName }),
    });

    const addedAllergen = await response.json();
    setAllergens((prev) => [...prev, addedAllergen]);
    setNewAllergenName("");
  };

  const handleEditAllergen = async () => {
    if (!editAllergen || !editAllergen.name.trim()) return;

    const response = await fetch("/api/allergens", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editAllergen),
    });

    const updatedAllergen = await response.json();
    setAllergens((prev) =>
      prev.map((allergen) =>
        allergen.id === updatedAllergen.id ? updatedAllergen : allergen
      )
    );
    setIsEditing(false);
    setEditAllergen(null);
  };

  const handleDeleteAllergen = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this allergen?"
    );
    if (!confirmDelete) return;

    await fetch("/api/allergens", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setAllergens((prev) => prev.filter((allergen) => allergen.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Allergens</h1>

      {/* Add Allergen Section */}
      <div className="mb-4">
        <input
          type="text"
          value={newAllergenName}
          onChange={(e) => setNewAllergenName(e.target.value)}
          placeholder="New Allergen"
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={handleAddAllergen}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Allergen
        </button>
      </div>

      {allergens.length === 0 && <LoadingModal message="Loading Allergens" />}

      {/* Allergen List */}
      <ul>
        {allergens.map((allergen, index) => (
          <motion.li
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex justify-between items-center p-4 mb-2 bg-white rounded shadow"
          >
            {isEditing && editAllergen?.id === allergen.id ? (
              <input
                type="text"
                value={editAllergen.name}
                onChange={(e) =>
                  setEditAllergen((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="p-2 border rounded flex-1 mr-4"
              />
            ) : (
              <span>{allergen.name}</span>
            )}

            <div className="flex gap-2">
              {isEditing && editAllergen?.id === allergen.id ? (
                <button
                  onClick={handleEditAllergen}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditAllergen(allergen);
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDeleteAllergen(allergen.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
