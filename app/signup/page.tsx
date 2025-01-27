"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isSignupSuccessful, setIsSignupSuccessful] = useState<boolean | null>(null);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setIsSignupSuccessful(null);

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsSignupSuccessful(true);
                setMessage("Signup successful. Wait for admin approval.");
                setEmail("");
                setPassword("");
                setName("");
                setTimeout(() => router.push("/login"), 3000); // Redirect to login after 3 seconds
            } else {
                setIsSignupSuccessful(false);
                setMessage(data.message || "Signup failed.");
            }
        } catch (error) {
            setIsSignupSuccessful(false);
            setMessage("An unexpected error occurred. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSignup}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                {message && (
                    <p className={`mb-4 ${isSignupSuccessful ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </p>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Sign Up
                </button>
                <p className="mt-4 text-sm text-center">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
}
