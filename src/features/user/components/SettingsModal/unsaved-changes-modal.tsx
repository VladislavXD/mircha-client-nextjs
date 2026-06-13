// src/components/ui/unsaved-changes-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UnsavedChangesModalProps {
  open: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export function UnsavedChangesModal({
  open,
  onSave,
  onDiscard,
  onCancel,
}: UnsavedChangesModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent
        className="w-[min(360px,90vw)] max-w-none gap-0 overflow-hidden rounded-[18px] border border-[#2a2a2a] bg-[#1a1a1a] p-0 shadow-2xl"
        // Останавливаем всплытие клика — иначе клик по оверлею
        // долетит до SettingsModal и закроет его тоже
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="px-5 pb-3 pt-5">
          <DialogTitle className="text-[15px] font-semibold text-[#f0f0f0]">
            Несохранённые изменения
          </DialogTitle>
          <DialogDescription className="mt-1 text-[13px] leading-snug text-[#777]">
            У вас есть изменения, которые ещё не сохранены. Что сделать с ними?
          </DialogDescription>
        </DialogHeader>

        <div className="flex  gap-1.5 px-5 pb-5 pt-2">
          <button
            type="button"
            onClick={onDiscard}
            className="w-full rounded-[11px] bg-[#2a2a2a] py-[10px] text-[13px] font-medium text-[#e55] transition-opacity hover:opacity-90 active:opacity-75"
          >
            Не сохранять
          </button>
          {/* Сохранить */}
          <button
            type="button"
            onClick={onSave}
            className="w-full rounded-[11px] bg-[#f0f0f0] py-[10px] text-[13px] font-semibold text-[#111] transition-opacity hover:opacity-90 active:opacity-75"
          >
            Сохранить
          </button>

          {/* Не сохранять */}

        </div>
      </DialogContent>
    </Dialog>
  );
}