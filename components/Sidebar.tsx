import Link from "next/link";

export default function Sidebar() {
    return (
        <div className="w-64 h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col shadow-lg sticky top-0">
            <h2 className="text-xl font-bold p-6 border-b border-gray-700">
                Admin Panel
            </h2>
            <nav className="flex flex-col flex-grow">
                <Link
                    href="/"
                    className="p-4 hover:bg-gray-700 hover:text-teal-400 transition duration-200"
                >
                    Search Allergies
                </Link>
                <Link
                    href="/manage/shops"
                    className="p-4 hover:bg-gray-700 hover:text-teal-400 transition duration-200"
                >
                    Manage Shops
                </Link>
                {/* <Link 
                    href="/manage/bowls" 
                    className="p-4 hover:bg-gray-700 hover:text-teal-400 transition duration-200"
                >
                    Manage Bowls
                </Link> */}
                <Link
                    href="/manage/allergens"
                    className="p-4 hover:bg-gray-700 hover:text-teal-400 transition duration-200"
                >
                    Manage Allergens
                </Link>
            </nav>
            <footer className="mt-auto p-4 border-t border-gray-700 text-sm text-gray-400">
                Tokyo Ramen Tours
            </footer>
        </div>
    );
}
