"use client";

import { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    isApproved: boolean;
}

export default function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            const res = await fetch("/api/admin/users");
            setUsers(await res.json());
        }
        fetchUsers();
    }, []);

    const handleApprove = async (userId: number) => {
        await fetch(`/api/admin/approve/${userId}`, { method: "POST" });
        setUsers((prev) =>
            prev.map((user) =>
                user.id === userId ? { ...user, isApproved: true } : user
            )
        );
    };

    const handleDelete = async (userId: number) => {
        await fetch(`/api/admin/delete/${userId}`, { method: "DELETE" });
        setUsers((prev) => prev.filter((user) => user.id !== userId));
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id} className="mb-4 flex justify-between items-center">
                        <div>
                            <p>{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        {!user.isApproved ? (
                            <button
                                onClick={() => handleApprove(user.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Approve
                            </button>
                        ) : (
                            <button
                                onClick={() => handleDelete(user.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
