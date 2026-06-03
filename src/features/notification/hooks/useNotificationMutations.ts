import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // Using the sonner component from ui

import { notificationService } from "../services/notification.service";

import { notificationKeys } from "./useNotificationQueries";

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: () => {
      toast.error("Не удалось отметить уведомление как прочитанное");
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success("Все уведомления прочитаны");
    },
    onError: () => {
      toast.error("Произошла ошибка при отметке всех уведомлений");
    },
  });
};
