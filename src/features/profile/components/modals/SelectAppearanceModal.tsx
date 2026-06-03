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
      <DialogContent className="w-[98vw] max-w-5xl bg-white dark:bg-[#101010] border-neutral-200 dark:border-neutral-800/70 rounded-[1.25rem] sm:rounded-[1.75rem] h-auto max-h-[85vh] flex flex-col p-0 overflow-hidden gap-0">

        {/* Header */}
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-neutral-200 dark:border-neutral-800/50 shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-bold">
            {appearanceType === "frame" ? "Выбор рамки аватара" : "Выбор фона профиля"}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`group relative rounded-[1rem] p-3 bg-neutral-50 dark:bg-[#161616] hover:bg-neutral-100 dark:hover:bg-[#1c1c1c] transition-all duration-200 cursor-pointer border-2 hover:shadow-lg ${
                  selectedItem?.id === item.id
                    ? "border-blue-500 dark:border-blue-400 shadow-md shadow-blue-500/20"
                    : "border-neutral-200 dark:border-neutral-800/70 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
                onClick={() =>
                  onSelectAppearance({
                    id: item.id,
                    url: item.url,
                    type: appearanceType!,
                  })
                }
              >
                {/* Preview area */}
                <div
                  className={`relative flex items-center justify-center rounded-[0.75rem] bg-neutral-200 dark:bg-neutral-900 overflow-visible ${
                    appearanceType === "frame" ? "aspect-square" : "aspect-[16/9]"
                  }`}
                >
                  {appearanceType === "frame" ? (
                    <div className="absolute inset-0 flex items-center justify-center overflow-visible">
                      <div className="relative w-full h-full flex items-center justify-center p-[10%]">
                        <img
                          alt="preview"
                          className="relative w-full h-full object-cover rounded-[0.75rem] z-0 shadow-sm"
                          src={userAvatarUrl || "/default-avatar.png"}
                        />
                        <img
                          alt={item.label}
                          className="absolute z-10 pointer-events-none"
                          style={{
                            width: "130%",
                            height: "130%",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            objectFit: "contain",
                          }}
                          src={item.url}
                        />
                      </div>
                    </div>
                  ) : item.type === "video" ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover rounded-[0.75rem]"
                    >
                      <source src={item.url} type="video/mp4" />
                    </video>
                  ) : item.type === "image" ? (
                    <img
                      alt={item.label}
                      className="absolute inset-0 w-full h-full object-cover rounded-[0.75rem]"
                      src={item.url}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full rounded-[0.75rem] bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Без фона
                    </div>
                  )}
                </div>

                {/* Label row */}
                <div className="mt-2.5 flex justify-between items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 truncate flex-1 leading-tight">
                    {item.label}
                  </span>
                  {selectedItem?.id === item.id && (
                    <span className="shrink-0 text-xs px-2 py-1 bg-blue-500 text-white rounded-full font-bold leading-none">
                      ✓
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-4 sm:px-6 py-3 sm:py-4 border-t border-neutral-200 dark:border-neutral-800/50 shrink-0">
          <Button
            className="w-full sm:w-auto sm:min-w-[120px] rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 font-semibold text-sm h-9"
            variant="ghost"
            onClick={onClose}
          >
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}