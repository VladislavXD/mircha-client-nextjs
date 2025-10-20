import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useParams } from "next/navigation";
import React from "react";

type Props = {
  status?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onOpenChange?: (open: boolean) => void;
  currentId?: string; 
};

const ProfileStatus = ({ status, onOpen, currentId }: Props) => {
  const {id} = useParams<{id: string}>();
  
  const isCurrentUser = currentId === id;
  return (
    <div className="relative inline-flex justify-center md:max-w-[150px] max-w-[130px] md:mt-0 mt-2">
      <div
        className={`
          relative
          bg-[#232324] text-white
          text-sm ${status ? "px-3 py-1" : ""}
          rounded-md
          min-w-[44px] min-h-[24px]
          break-words whitespace-normal text-center
          after:content-['']
          after:absolute
          after:left-1/2 after:-translate-x-1/2
          after:-top-2
          after:w-0 after:h-0
          after:border-l-8 after:border-l-transparent
          after:border-r-8 after:border-r-transparent
          after:border-b-8 after:border-b-[#232324]
        `}
      >
        {
          isCurrentUser ? (<Button onClick={onOpen}  variant="flat" size="sm" className="p-0 h-auto min-w-0 text-xs w-full px-2 py-1 whitespace-normal break-words leading-tight">{status ? status : "Добавить статус"}</Button>) : <>{status}</>
        }
				
      </div>
    </div>
  );
};

export default ProfileStatus;
