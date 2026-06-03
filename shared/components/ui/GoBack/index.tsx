"use client";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const GoBack = ({title}: {title: string}) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center gap-2 mt-3">
    <button
      className="group flex items-center gap-2 text-2xl font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors w-fit bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] px-3 py-1.5 -ml-3 rounded-full cursor-pointer"
      onClick={handleGoBack}
    >
      <ChevronLeft
      className="transition-transform group-hover:-translate-x-0.5 !p-0 !m-0"
      size={25}
      strokeWidth={2.5}
      color="white"
      
      />
     
      
    </button>
      <span className="text-2xl font-semibold text-white ">{title}</span>
    </div>
    
  );
};

export default GoBack;
