"use client";

import { useState } from "react";
import { Eye, EyeOff, Key } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { useChangePassword } from "../hooks";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps): JSX.Element {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations("Toasts");

  const { changePasswordAsync, isLoading } = useChangePassword();

  const handleSubmit = () => {
    setError("");

    // Валидация
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Заполните все поля");

      return;
    }

    if (newPassword.length < 6) {
      setError("Новый пароль должен содержать минимум 6 символов");

      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Новый пароль и подтверждение не совпадают");

      return;
    }

    if (currentPassword === newPassword) {
      setError("Новый пароль должен отличаться от текущего");

      return;
    }

    toast.promise(changePasswordAsync({ currentPassword, newPassword }), {
      loading: t("sending"),
      success: {
        message: t("passwordChangedSuccess"),
        description: t("passwordChangedDesc"),
      },
      error: t("passwordChangeError"),
    });
    handleClose();
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            <span>Смена пароля</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Текущий пароль */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Текущий пароль</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                placeholder="Введите текущий пароль"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Новый пароль */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Новый пароль</Label>
            <div className="relative">
              <Input
                id="newPassword"
                placeholder="Введите новый пароль"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Подтверждение нового пароля */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                placeholder="Введите новый пароль еще раз"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Ошибка валидации */}
          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button disabled={isLoading} variant="ghost" onClick={handleClose}>
            Отмена
          </Button>
          <Button disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? t("sending") : "Изменить пароль"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
