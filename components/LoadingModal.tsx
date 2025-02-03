"use client";

import { motion } from "framer-motion";

export function RamenLoadingModal({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
        <h2 className="text-xl font-bold mb-4">
          {message ? message : "Processing your request..."}
        </h2>

        {/* Ramen Bowl SVG with Enhanced Dynamic Animation */}
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: [-10, 10, -10], rotate: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              width="120"
              height="120"
            >
              {/* Bowl with red and black stripes */}
              <motion.path
                d="M50 150 Q100 180, 150 150 L170 110 Q100 130, 30 110 Z"
                fill="#D33E3E"
                stroke="#000"
                strokeWidth="3"
                animate={{ rotate: [-3, 3, -3] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              />

              {/* Noodles Floating and Waving Dynamically */}
              <motion.path
                d="M60 120 Q80 90, 100 120 T140 120"
                fill="none"
                stroke="#FCD34D"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ pathLength: [0.5, 1, 0.5], rotate: [-5, 5, -5] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              />

              {/* Soup sloshing effect */}
              <motion.ellipse
                cx="100"
                cy="135"
                rx="50"
                ry="10"
                fill="#E07A5F"
                animate={{
                  scaleX: [1, 1.1, 1],
                  scaleY: [1, 0.9, 1],
                  rotate: [-3, 3, -3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />

              {/* Egg */}
              <motion.ellipse
                cx="140"
                cy="110"
                rx="15"
                ry="20"
                fill="#FFF"
                stroke="#000"
                strokeWidth="2"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
              <motion.ellipse
                cx="140"
                cy="110"
                rx="7"
                ry="10"
                fill="#FBC02D"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />

              {/* Chopsticks swaying dynamically */}
              <motion.rect
                x="120"
                y="50"
                width="6"
                height="70"
                fill="#8B5A2B"
                transform="rotate(20 120 50)"
                animate={{ rotate: [15, 25, 15] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
              <motion.rect
                x="130"
                y="50"
                width="6"
                height="70"
                fill="#8B5A2B"
                transform="rotate(20 130 50)"
                animate={{ rotate: [15, 25, 15] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Cancel Button */}
        <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function LoadingModal({
  message: message,
  color: color,
}: {
  message?: string | undefined;
  color?: string | undefined;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div
          className={`w-12 h-12 border-t-4 border-${
            color ? color : "blue"
          }-600 border-solid rounded-full animate-spin`}
        ></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">
          {message ? message : "Loading results..."}
        </p>
      </div>
    </div>
  );
}
