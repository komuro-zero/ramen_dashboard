"use client";

import { useEffect, useState } from "react";

interface User {
    id: number;
    email: string;
    name: string;
    isAdmin: boolean;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("/api/users");
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchUsers();
    }, []);

    const toggleApproval = async (userId: number, currentStatus: boolean) => {
        setLoading(true);
        try {
            const res = await fetch("/api/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, isApproved: !currentStatus }),
            });

            if (!res.ok) {
                throw new Error("Failed to update approval status");
            }

            const updatedUser: User = await res.json();

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === updatedUser.id ? updatedUser : user
                )
            );
        } catch (error) {
            console.error("Error updating approval status:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Email</th>
                        <th className="p-4 text-left">isAdmin</th>
                        <th className="p-4 text-left">isApproved</th>
                        <th className="p-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b">
                            <td className="p-4">{user.name}</td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4">{user.isAdmin ? "Yes" : "No"}</td>
                            <td className="p-4">
                                <span
                                    className={`px-2 py-1 rounded text-white ${user.isApproved ? "bg-green-500" : "bg-red-500"
                                        }`}
                                >
                                    {user.isApproved ? "Approved" : "Pending"}
                                </span>
                            </td>
                            <td className="p-4">
                                <button
                                    onClick={() => toggleApproval(user.id, user.isApproved)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                                    disabled={loading}
                                >
                                    {user.isApproved ? "Revoke" : "Approve"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
