"use client"; // Ensure this is at the top of the file

import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for `useRouter` in the App Router
import { motion } from "framer-motion";
import { LoadingModal } from "@/components/LoadingModal";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsChecked(!isChecked);
  };

  const mode = isChecked ? "primary" : "secondary";

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      setError("");

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/dashboard/shops"); // Redirect to the homepage or another protected page
      } else {
        const data = await res.json();
        setError(data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      {isLoading && <LoadingModal message="Logging in..." color="green" />}
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
        <motion.button
          whileTap={{ scale: 0.9, translateY: 5 }}
          type="submit"
          className={[
            "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 button",
            `button--${mode}`,
          ].join(" ")}
          onClick={handleClick}
        >
          Log In
        </motion.button>
        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
