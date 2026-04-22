"use client";

import type { AppearanceType, SelectedAppearanceItem } from "../../types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SelectAppearanceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  appearanceType: AppearanceType;
  selectedItem: SelectedAppearanceItem | null;
  items: Array<{
    id: string;
    url: string;
    label: string;
    type?: string;
  }>;
  userAvatarUrl?: string;
  onSelectAppearance: (item: SelectedAppearanceItem) => void;
}

export function SelectAppearanceModal({
  isOpen,
  onOpenChange,
  onClose,
  appearanceType,
  selectedItem,
  items,
  userAvatarUrl,
  onSelectAppearance,
}: SelectAppearanceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white dark:bg-[#101010] border-neutral-200 dark:border-neutral-800/70 rounded-[1.5rem] sm:rounded-[2rem]">
        <DialogHeader>
          <DialogTitle>
            {appearanceType === "frame" ? "Выбор рамки" : "Выбор фона"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group relative rounded-[1.25rem] p-4 bg-neutral-50 dark:bg-[#161616] hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] transition cursor-pointer overflow-hidden border-2 ${
                selectedItem?.id === item.id
                  ? "border-neutral-900 dark:border-white"
                  : "border-neutral-200 dark:border-neutral-800/70"
              }`}
            >
              <div
                className={`relative flex items-center justify-center overflow-hidden rounded-[1rem] bg-neutral-200 dark:bg-neutral-900 ${
                  appearanceType === "frame" ? "aspect-square" : "aspect-[16/9]"
                }`}
              >
                {appearanceType === "frame" ? (
                  <>
                    <img
                      alt={item.label}
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
                      src={item.url}
                    />
                    <img
                      alt="preview"
                      className="w-2/3 h-2/3 object-cover rounded-[1.5rem] pointer-events-none"
                      src={userAvatarUrl || "/default-avatar.png"}
                    />
                  </>
                ) : item.type === "video" ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src={item.url} type="video/mp4" />
                  </video>
                ) : item.type === "image" ? (
                  <img
                    alt={item.label}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={item.url}
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm font-medium text-neutral-500">
                    Без фона
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center gap-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate flex-1">
                  {item.label}
                </span>
                <Button
                  className="rounded-full text-xs shrink-0"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    onSelectAppearance({
                      id: item.id,
                      url: item.url,
                      type: appearanceType!,
                    })
                  }
                >
                  Выбрать
                </Button>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button className="rounded-full" variant="ghost" onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
