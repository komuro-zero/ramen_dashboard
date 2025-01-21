"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    // Load the current theme from localStorage or default to light
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark";
        if (savedTheme) {
            setTheme(savedTheme);
            document.body.classList.toggle("dark", savedTheme === "dark");
        }
    }, []);

    // Toggle the theme and save it to localStorage
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.body.classList.toggle("dark", newTheme === "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
    );
}
