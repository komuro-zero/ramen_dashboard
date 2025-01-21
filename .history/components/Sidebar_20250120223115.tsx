import Link from "next/link";

export default function Sidebar() {
    return (
        <div className="w-64 h-full bg-gray-800 text-white flex flex-col">
            <h2 className="text-lg font-bold p-4">Admin Panel</h2>
            <nav className="flex flex-col">
                <Link href="/manage/shops">
                    <a className="p-4 hover:bg-gray-700">Manage Shops</a>
                </Link>
                <Link href="/manage/bowls">
                    <a className="p-4 hover:bg-gray-700">Manage Bowls</a>
                </Link>
                <Link href="/manage/allergens">
                    <a className="p-4 hover:bg-gray-700">Manage Allergens</a>
                </Link>
            </nav>
        </div>
    );
}
