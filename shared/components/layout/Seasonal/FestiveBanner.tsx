"use client";

import { useEffect, useState } from "react";

/**
 * Праздничная гирлянда с мерцающими огоньками
 * Размещается над хедером как тонкая полоска
 */
export default function FestiveBanner() {
  const [lights, setLights] = useState<number[]>([]);

  useEffect(() => {
    // Создаём 30-40 огоньков равномерно распределённых
    const numLights = 35;
    setLights(Array.from({ length: numLights }, (_, i) => i));
  }, []);

  const getRandomColor = (index: number) => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-400",
      "bg-pink-500",
    ];
    return colors[index % colors.length];
  };

  const getRandomDelay = (index: number) => {
    return `${(index * 0.1) % 2}s`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none">
      <div className="relative w-full h-full bg-gradient-to-r from-green-900 via-green-800 to-green-900">
        {/* Провод гирлянды */}
        <div className="absolute w-full h-0.5 bg-gray-800 top-1/2 -translate-y-1/2" />

        {/* Огоньки */}
        {lights.map((light) => (
          <div
            key={light}
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              left: `${(light / lights.length) * 100}%`,
            }}
          >
            <div
              className={`w-2 h-2 rounded-full ${getRandomColor(light)} shadow-lg animate-twinkle`}
              style={{
                animationDelay: getRandomDelay(light),
              }}
            />
          </div>
        ))}
      </div>

      {/* CSS для мерцания */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
