import Link from "next/link";

export default function Sidebar() {
    return (
        <div className="w-64 h-full bg-gray-800 text-white flex flex-col">
            <h2 className="text-lg font-bold p-4">Admin Panel</h2>
            <nav className="flex flex-col">
                <Link href="/" className="p-4 hover:bg-gray-700">
                    Search Allergies
                </Link>
                <Link href="/manage/shops" className="p-4 hover:bg-gray-700">
                    Manage Shops
                </Link>
                {/* <Link href="/manage/bowls" className="p-4 hover:bg-gray-700">
                    Manage Bowls
                </Link> */}
                <Link href="/manage/allergens" className="p-4 hover:bg-gray-700">
                    Manage Allergens
                </Link>
            </nav>
        </div>
    );
}
