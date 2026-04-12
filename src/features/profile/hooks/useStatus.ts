"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { userService } from "@/src/features/user/services";
import { queryClient } from "@/lib/queryClient";

/**
 * Хук для управления статусом пользователя.
 * Отделен от основного хука профиля для Single Responsibility.
 */
export function useStatus(userId?: string, currentStatus?: string) {
  // Модалка статуса
  const [isOpen, setIsOpen] = useState(false);

  // Локальное состояние для редактирования
  const [updateStatus, setUpdateStatus] = useState<string>(currentStatus || "");

  // Максимальная длина статуса
  const maxLength = 60;
  const currentLength = updateStatus?.length || 0;
  const isMaxReached = currentLength >= maxLength;

  // Мутация для обновления статуса
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      if (!userId) throw new Error("User ID is required");
      const formData = new FormData();

      formData.append("status", newStatus);

      return userService.updateProfile(formData);
    },
    onSuccess: async () => {
      toast.success("Статус обновлен");
      // Инвалидируем кеш профиля
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["user", userId],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: ["profile"],
          refetchType: "active",
        }),
      ]);
      // Закрываем модалку
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Ошибка при обновлении статуса");
    },
  });

  // Обработчик сохранения статуса
  const handleSaveStatus = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isMaxReached) return;

    try {
      await updateStatusMutation.mutateAsync(updateStatus);
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  // Обработчик открытия модалки
  const handleOpenStatusModal = () => {
    setUpdateStatus(currentStatus || "");
    setIsOpen(true);
  };

  return {
    // Модалка
    statusModal: {
      isOpen,
      onOpenChange: setIsOpen,
    },

    // Состояние
    updateStatus,
    setUpdateStatus,
    maxLength,
    currentLength,
    isMaxReached,
    isUpdating: updateStatusMutation.isPending,

    // Действия
    handleSaveStatus,
    handleOpenStatusModal,
  };
}
