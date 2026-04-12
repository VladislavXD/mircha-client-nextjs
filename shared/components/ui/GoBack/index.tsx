"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const GoBack = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <button
      className="group flex items-center gap-2 text-[14px] font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors w-fit bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] px-3 py-1.5 -ml-3 mb-2 rounded-full cursor-pointer"
      onClick={handleGoBack}
    >
      <ArrowLeft
        className="transition-transform group-hover:-translate-x-0.5"
        size={18}
        strokeWidth={2.5}
      />
      Назад
    </button>
  );
};

export default GoBack;
