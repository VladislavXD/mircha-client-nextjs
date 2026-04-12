"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmAppearanceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  appearanceType: "frame" | "background" | null;
  isUpdating: boolean;
  onConfirm: () => void;
}

export function ConfirmAppearanceModal({
  isOpen,
  onOpenChange,
  appearanceType,
  isUpdating,
  onConfirm,
}: ConfirmAppearanceModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-sm rounded-[1.5rem]">
        <AlertDialogHeader>
          <AlertDialogTitle>Подтверждение</AlertDialogTitle>
          <AlertDialogDescription>
            Вы точно хотите применить выбранное{" "}
            {appearanceType === "frame"
              ? "оформление аватара"
              : "оформление шапки профиля"}
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              className="rounded-full"
              disabled={isUpdating}
              variant="ghost"
            >
              Отмена
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button disabled={isUpdating} onClick={onConfirm}>
              {isUpdating ? "Применяем..." : "Применить"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
