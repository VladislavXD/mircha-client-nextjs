"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Edit2, LayoutTemplate } from "lucide-react";
import { useDispatch } from "react-redux";

import { openSettingsModal } from "@/src/store/settingsModal/settingsModal.slice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ProfileActionsProps {
  onOpenAppearance: (type: "frame" | "background") => void;
}

export function ProfileActions({ onOpenAppearance }: ProfileActionsProps) {
  const t = useTranslations("Profile");
  const dispatch = useDispatch();

  return (
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <Button
        className="bg-white hover:bg-gray-50 text-black border-2 border-black rounded-lg font-medium shadow-md transition-all duration-200"
        size="sm"
        variant="outline"
        onClick={() => dispatch(openSettingsModal("profile"))}
      >
        <Edit2 className="mr-1.5" size={14} />
        {t("edit")}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="bg-white hover:bg-gray-50 text-black border-2 border-black rounded-lg font-medium shadow-md transition-all duration-200"
            size="sm"
            variant="outline"
          >
            <LayoutTemplate className="mr-1.5" size={14} />
            {t("appearance")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-[1rem]">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onOpenAppearance("frame")}
          >
            {t("avatarFrame")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onOpenAppearance("background")}
          >
            {t("profileBackground")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
