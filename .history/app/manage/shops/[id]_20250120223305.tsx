"use client";

import { useRouter } from "next/navigation";

export default function EditShop({ params }: { params: { id: string } }) {
    const router = useRouter();

    const handleSave = () => {
        // Save changes to the shop
        router.push("/manage/shops");
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Edit Shop</h1>
            <form className="space-y-4">
                <div>
                    <label className="block font-medium">Shop Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        defaultValue={`Shop ${params.id}`}
                    />
                </div>
                <div>
                    <label className="block font-medium">Address</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        defaultValue="123 Example St."
                    />
                </div>
                <button
                    onClick={handleSave}
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Save
                </button>
            </form>
        </div>
    );
}
