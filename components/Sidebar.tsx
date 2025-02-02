"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LoadingModal } from "./LoadingModal";

export default function Sidebar() {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const mode = isChecked ? "primary" : "secondary";

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const res = await fetch("/api/auth/verify");
        if (!res.ok) throw new Error("Failed to verify user");
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Error verifying JWT token:", error);
      }
    }
    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      setIsLoading(true);
      setIsChecked(!isChecked);
      document.cookie = "authToken=; Max-Age=0; path=/;";
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");

      const response = await fetch(`/api/logout`, { method: "POST" });
      if (response.ok) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 0);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col shadow-lg sticky top-0">
      {isLoading && <LoadingModal message="Logging out..." color="red" />}
      <h2 className="text-xl font-bold p-6 border-b border-gray-700">
        Admin Panel
      </h2>
      <nav className="flex flex-col flex-grow">
        <Link
          href="/dashboard/shops"
          className="p-4 hover:bg-gray-700 hover:text-teal-400 transition duration-200"
        >
          Manage Shops
        </Link>
        <Link
          href="/dashboard/allergens"
          className="p-4 hover:bg-gray-700 hover:text-teal-400 transition duration-200"
        >
          Manage Allergens
        </Link>
        {isAdmin && (
          <Link
            href="/dashboard/admin"
            className="p-4 hover:bg-gray-700 hover:text-teal-400 transition duration-200"
          >
            Admin Panel
          </Link>
        )}
      </nav>
      <footer className="mt-auto p-4 border-t border-gray-700 text-sm text-gray-400">
        <motion.button
          whileTap={{ scale: 0.9, translateY: 5 }}
          type="submit"
          className={[
            "w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 button",
            `button--${mode}`,
          ].join(" ")}
          onClick={handleLogout}
        >
          Log Out
        </motion.button>
        <p className="mt-4 text-center">Tokyo Ramen Tours</p>
      </footer>
    </div>
  );
}
