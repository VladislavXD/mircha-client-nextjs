import { toast } from "sonner";
import { BadgePlus, Link as LinkIcon, Send } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MetaInfo from "@/shared/components/ui/MetaInfo";

type shareDropdownProps = {
  linkToCopy: string;
};

export default function ShareDropdown({ linkToCopy }: shareDropdownProps) {
  const [isCopied, setIsCopied] = useState(false);
  const t = useTranslations("Toasts");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(linkToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 5000); // Сброс состояния через 5 секунд

      toast.success(t("linkCopied"));
    } catch (e) {
      console.error("Failed to copy link: ", e);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className=" flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <MetaInfo Icon={Send} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="sm:w-60 w-44 rounded-[1.25rem] p-none shadow-xl border-neutral-200 dark:border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem className="cursor-pointer focus:bg-neutral-100 dark:focus:bg-neutral-800 gap-3 rounded-[0.85rem] p-2 sm:p-3 text-[12px] sm:text-[15px] font-medium active:scale-95 transition-all duration-200 ">
          <BadgePlus className="h-[22px] w-[22px] shrink-0" strokeWidth={1.5} />
          <span>Добавить в историю</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer focus:bg-neutral-100 dark:focus:bg-neutral-800 gap-3 rounded-[0.85rem] p-2 sm:p-3 text-[12px] sm:text-[15px] font-medium active:scale-95 transition-all duration-200 "
          onClick={copyToClipboard}
        >
          <LinkIcon className="h-[22px] w-[22px] shrink-0" strokeWidth={1.5} />
          <span>{isCopied ? "Скопировано!" : "Копировать ссылку"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
