"use client";

import { useEffect, useState } from "react";
import { LoadingModal } from "@/components/LoadingModal";
import { motion } from "framer-motion";

interface Shop {
  id: number;
  name: string;
  address: string;
  ramen: Ramen[];
}

interface Ramen {
  id: number;
  name: string;
  description: string;
  price: number;
  allergens: Allergen[];
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
  const [editRamen, setEditRamen] = useState<Ramen[]>([]);
  const [shopToDelete, setShopToDelete] = useState<Shop | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const shopRes = await fetch("/api/shops");
      const allergenRes = await fetch("/api/allergens");
      setShops(await shopRes.json());
      setAllergens(await allergenRes.json());
    }
    fetchData();
  }, []);

  const handleDeleteShop = async () => {
    if (!shopToDelete) return;

    try {
      setIsDeleting(true);
      setIsConfirmOpen(false);

      console.log("Deleting shop:", shopToDelete);
      console.log("Deleting shop id:", shopToDelete.id);
      const res = await fetch(`/api/shops`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: shopToDelete.id }),
      });

      if (!res.ok) {
        console.error(`Failed to delete shop: ${res.status} ${res.statusText}`);
        alert("Failed to delete the shop. Please try again.");
        setShopToDelete(null);
        setIsDeleting(false);
        return;
      }

      setShops((prev) => prev.filter((s) => s.id !== shopToDelete.id));
      setShopToDelete(null);
      setIsDeleting(false);
    } catch (error) {
      console.error("Error deleting shop:", error);
      alert("An error occurred while deleting the shop.");
    }
  };

  const handleSave = async () => {
    const payload = {
      id: editShop?.id || null,
      name: editShop?.name || "",
      address: editShop?.address || "",
      ramen: editRamen.map((r) => ({
        ...r,
        allergens: r.allergens.map((a) => ({ id: a.id })), // Send allergen IDs
      })),
    };

    const method = editShop && editShop.id ? "PUT" : "POST";
    const url =
      editShop && editShop.id ? `/api/shops/${editShop.id}` : "/api/shops";

    try {
      setIsSaving(true);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error(`Failed to save shop: ${res.status} ${res.statusText}`);
        alert("Failed to save the shop. Please try again.");
        return;
      }

      const updatedShop = await res.json();

      if (editShop && editShop.id) {
        setShops((prev) =>
          prev.map((s) => (s.id === updatedShop.id ? updatedShop : s))
        );
      } else {
        setShops((prev) => [...prev, updatedShop]);
      }

      setIsModalOpen(false);
      setEditShop(null);
    } catch (error) {
      console.error("Error saving shop:", error);
      alert("An error occurred while saving the shop.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddShop = () => {
    setEditShop({
      id: 0,
      name: "",
      address: "",
      ramen: [],
    }); // Initialize a new shop object
    setEditRamen([]);
    setIsModalOpen(true);
  };

  const handleAddRamen = () => {
    setEditRamen((prev) => [
      ...prev,
      { id: Date.now(), name: "", description: "", price: 0, allergens: [] },
    ]);
  };

  const handleDeleteRamen = (id: number) => {
    setEditRamen((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleAllergen = (ramenId: number, allergenId: number) => {
    setEditRamen((prev) =>
      prev.map((ramen) =>
        ramen.id === ramenId
          ? {
              ...ramen,
              allergens: ramen.allergens.some((a) => a.id === allergenId)
                ? ramen.allergens.filter((a) => a.id !== allergenId)
                : [
                    ...ramen.allergens,
                    allergens.find((a) => a.id === allergenId)!,
                  ],
            }
          : ramen
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-100 min-h-screen p-6"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-gray-800"
      >
        Manage Shops
      </motion.h1>
      <motion.button
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAddShop}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-6 shadow-md hover:bg-blue-700 transition duration-300"
      >
        Add Shop
      </motion.button>
      {shops.length === 0 && <LoadingModal message="Loading Shops..." />}
      <motion.ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {shops.map((shop, index) => (
          <motion.li
            key={shop.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 relative"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {shop.name}
              </h2>
              <button
                onClick={() => {
                  setEditShop(shop);
                  setEditRamen(shop.ramen);
                  setIsModalOpen(true);
                }}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300"
              >
                Edit
              </button>
            </div>
            <p className="text-gray-600 mb-4">{shop.address}</p>
            <ul className="space-y-2">
              {shop.ramen.map((ramen) => (
                <li
                  key={ramen.id}
                  className="bg-gray-50 rounded-md p-3 shadow-sm border border-gray-200"
                >
                  <h3 className="text-md font-medium text-gray-700">
                    {ramen.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ¥{ramen.price.toLocaleString("ja-JP")}
                  </p>
                  <ul className="mt-1 flex flex-wrap gap-1">
                    {ramen.allergens.map((allergen) => (
                      <li
                        key={allergen.id}
                        className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded"
                      >
                        {allergen.name}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </motion.ul>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
          onClick={(e) => {
            // Close the modal only if clicking outside the modal content
            if ((e.target as HTMLElement).classList.contains("bg-gray-800")) {
              setIsModalOpen(false);
            }
          }}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-4"
            onClick={(e) => e.stopPropagation()} // Prevent modal click from closing it
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <h2 className="text-xl font-bold mb-4">
                {editShop && editShop.id ? "Edit Shop" : "Add Shop"}
              </h2>
              {isDeleting && <LoadingModal message="Deleting Shop..." />}
              <motion.button
                onClick={() => {
                  setShopToDelete(editShop);
                  setIsConfirmOpen(true);
                }}
                className="mb-4 px-4 py-2 bg-red-400 text-white rounded hover:bg-red-600 transition duration-300 w-full"
              >
                Delete Shop
              </motion.button>

              {/* Shop Name */}
              <label className="block font-semibold text-gray-800 mb-2">
                Shop Name
              </label>
              <input
                type="text"
                value={editShop?.name || ""}
                onChange={(e) =>
                  setEditShop((prev) => ({ ...prev!, name: e.target.value }))
                }
                className="w-full p-2 border rounded mb-4"
                required
              />

              {/* Shop Address */}
              <label className="block font-semibold text-gray-800 mb-2">
                Shop Address
              </label>
              <input
                type="text"
                value={editShop?.address || ""}
                onChange={(e) =>
                  setEditShop((prev) => ({ ...prev!, address: e.target.value }))
                }
                className="w-full p-2 border rounded mb-4"
                required
              />

              {/* Ramen Section */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Ramen
              </h3>
              {editRamen.map((ramen) => (
                <div
                  key={ramen.id}
                  className="mb-4 border rounded p-4 bg-gray-50"
                >
                  <input
                    type="text"
                    value={ramen.name || ""}
                    placeholder="Ramen Name"
                    onChange={(e) =>
                      setEditRamen((prev) =>
                        prev.map((r) =>
                          r.id === ramen.id ? { ...r, name: e.target.value } : r
                        )
                      )
                    }
                    className="w-full p-2 border rounded mb-2"
                    required
                  />
                  <textarea
                    value={ramen.description || ""}
                    placeholder="Ramen Description"
                    onChange={(e) =>
                      setEditRamen((prev) =>
                        prev.map((r) =>
                          r.id === ramen.id
                            ? { ...r, description: e.target.value }
                            : r
                        )
                      )
                    }
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    value={ramen.price || 0}
                    placeholder="Price (in JPY)"
                    inputMode="numeric"
                    pattern="\d*"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setEditRamen((prev) =>
                        prev.map((r) =>
                          r.id === ramen.id
                            ? { ...r, price: parseInt(value || "0") }
                            : r
                        )
                      );
                    }}
                    className="w-full p-2 border rounded mb-2"
                    required
                  />

                  {/* Allergen Section */}
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Allergens
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allergens.map((allergen) => (
                      <label
                        key={allergen.id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={ramen.allergens.some(
                            (a) => a.id === allergen.id
                          )}
                          onChange={() => toggleAllergen(ramen.id, allergen.id)}
                        />
                        <span className="text-gray-700 text-sm">
                          {allergen.name}
                        </span>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={() => handleDeleteRamen(ramen.id)}
                    type="button"
                    className="mt-2 px-3 py-1 bg-red-300 text-white rounded hover:bg-red-600 transition duration-300"
                  >
                    Remove Ramen
                  </button>
                </div>
              ))}

              {/* Add Ramen Button */}
              <button
                onClick={handleAddRamen}
                type="button"
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 w-full"
              >
                Add Ramen
              </button>

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                >
                  Save
                </button>
              </div>
              {isSaving && <LoadingModal message="Saving Shop..." />}
            </form>
          </div>
        </div>
      )}
      {isConfirmOpen && (
        <motion.div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <motion.div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this shop?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteShop}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
