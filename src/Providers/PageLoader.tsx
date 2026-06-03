"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setIsExiting(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };

    if (document.readyState === "complete") {
      const timer = setTimeout(handleLoad, 800);
      return () => clearTimeout(timer);
    }

    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden transition-opacity ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
      style={{
        transitionDuration: "0.8s",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <style>{`
        @keyframes revealMask {
          0%, 20%  { transform: scaleY(1); }
          60%, 80% { transform: scaleY(0); }
          100%     { transform: scaleY(1); }
        }

        @keyframes logoPullInside {
          0% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
          100% {
            transform: scale(0.1) translateY(-20px);
            opacity: 0;
          }
        }

        @keyframes backgroundFadeExit {
          0% {
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            filter: blur(4px);
          }
        }

        .reveal-logo {
          position: relative;
          width: 128px;
          height: 128px;
        }

        .reveal-mask {
          position: absolute;
          inset: 0;
          background: #000;
          transform-origin: center bottom;
          animation: revealMask 2.4s ease-in-out infinite;
          pointer-events: none;
        }

        .logo-pull-inside {
          animation: logoPullInside 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
        }

        .bg-exit-smooth {
          animation: backgroundFadeExit 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <div
        className={`relative flex-1 flex items-center justify-center w-full h-full ${
          isExiting ? "bg-exit-smooth" : ""
        }`}
      >
        {/* Логотип с reveal маской */}
        <div className={`reveal-logo ${isExiting ? "logo-pull-inside" : ""}`}>
          <Image
            src="/mrchLogo_light.svg"
            alt="MirChan Logo"
            fill
            priority
            className="object-contain"
          />
          {!isExiting && <div className="reveal-mask" />}
        </div>
      </div>

      {/* Текст внизу */}
      <div className="mb-16 text-center">
        <p className="text-gray-300 text-sm font-light tracking-widest">
          Connect • Share • Discuss
        </p>
        <div className="my-3 flex justify-center">
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>
        <p className="text-gray-500 text-xs font-light">from</p>
        <p className="text-white text-lg font-semibold tracking-wide mt-1">
          Mirchan
        </p>
      </div>
    </div>
  );
}
