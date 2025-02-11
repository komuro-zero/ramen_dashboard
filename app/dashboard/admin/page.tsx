"use client";

import { useEffect, useState } from "react";
import { LoadingModal } from "@/components/LoadingModal";

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"approve" | "admin" | null>(
    null
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    async function fetchCurrentUser() {
      try {
        const res = await fetch("/api/admin/current_user");
        const data = await res.json();
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }

    async function fetchData() {
      try {
        console.log("Fetching users and current user...");
        setIsLoading(true);
        await Promise.all([fetchUsers(), fetchCurrentUser()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const openModal = (user: User, type: "approve" | "admin") => {
    if (currentUser?.id === user.id) return;
    setSelectedUser(user);
    setActionType(type);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setActionType(null);
  };

  const confirmUpdate = async () => {
    if (!selectedUser || !actionType) return;
    setLoading(true);

    const updatedStatus = {
      userId: selectedUser.id,
      isApproved:
        actionType === "approve"
          ? !selectedUser.isApproved
          : selectedUser.isApproved,
      isAdmin:
        actionType === "admin" ? !selectedUser.isAdmin : selectedUser.isAdmin,
    };

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStatus),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const updatedUser: User = await res.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      {isLoading && <LoadingModal message="Loading Users" />}
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">isAdmin</th>
            <th className="p-4 text-left">isApproved</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-4">{user.name}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4 cursor-pointer">
                <button
                  onClick={() => openModal(user, "admin")}
                  className={`px-3 py-1 text-white rounded-md ${user.isAdmin
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                    } ${currentUser?.id === user.id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                    }`}
                  disabled={currentUser?.id === user.id}
                >
                  {user.isAdmin ? "Yes" : "No"}
                </button>
              </td>
              <td className="p-4 cursor-pointer">
                <button
                  onClick={() => openModal(user, "approve")}
                  className={`px-3 py-1 text-white rounded-md ${user.isApproved
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                    } ${currentUser?.id === user.id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                    }`}
                  disabled={currentUser?.id === user.id}
                >
                  {user.isApproved ? "Approved" : "Pending"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && actionType && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">
              {actionType === "admin"
                ? `Change Admin Status for ${selectedUser.name}?`
                : `Approve ${selectedUser.name}?`}
            </h2>
            <p className="mb-4">
              Are you sure you want to{" "}
              {actionType === "admin"
                ? selectedUser.isAdmin
                  ? "revoke admin access"
                  : "grant admin access"
                : selectedUser.isApproved
                  ? "revoke approval"
                  : "approve"}{" "}
              for this user?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
                disabled={loading}
              >
                {loading ? "Updating..." : "Confirm"}
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
