"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function LoadingNoodles() {
    const [ramenArray, setRamenArray] = useState<{ id: number; x: number; delay: number }[]>([]);

    useEffect(() => {
        const ramenData = Array.from({ length: 30 }, (_, index) => ({
            id: index,
            x: Math.random() * 100, // Random X position (Client-side only)
            delay: 0, // Random delay (Client-side only)
        }));
        setRamenArray(ramenData);
    }, []);

    return (
        <div className="bg-gray-100 overflow-hidden">
            {ramenArray.map(({ id, x, delay }) => (
                <motion.div
                    key={id}
                    className="absolute text-4xl"
                    initial={{ y: "-10vh", x: `${x}vw`, opacity: 0 }}
                    animate={{
                        y: "110vh", // Moves downward
                        opacity: 1,
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2, // Random speed (3s to 5s)
                        delay: delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    🍜
                </motion.div>
            ))}
        </div>
    );
}
