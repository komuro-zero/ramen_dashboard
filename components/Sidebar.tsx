"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const router = useRouter();

    const handleLogout = async () => {
        document.cookie = "authToken=; Max-Age=0; path=/;";
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");

        const response = await fetch(`/api/logout`, { method: "POST" });
        if (response.ok) {
            // Wait for cookie deletion to propagate before redirecting
            setTimeout(() => {
                window.location.href = "/login";
            }, 500);
        }
    };

    return (
        <div className="w-64 h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col shadow-lg sticky top-0">
            <h2 className="text-xl font-bold p-6 border-b border-gray-700">
                Admin Panel
            </h2>
            <nav className="flex flex-col flex-grow">
                <Link
                    href="/dashboard/main"
                    className="p-4 hover:bg-gray-700 hover:text-teal-400 transition duration-200"
                >
                    Search Allergies
                </Link>
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
            </nav>
            <footer className="mt-auto p-4 border-t border-gray-700 text-sm text-gray-400">
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                >
                    Logout
                </button>
                <p className="mt-4 text-center">Tokyo Ramen Tours</p>
            </footer>
        </div>
    );
}
