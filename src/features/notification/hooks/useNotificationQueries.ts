import { useQuery } from "@tanstack/react-query";

import { notificationService } from "../services/notification.service";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (page: number, limit: number, unreadOnly: boolean) =>
    [...notificationKeys.lists(), { page, limit, unreadOnly }] as const,
  unreadCount: () => [...notificationKeys.all, "unreadCount"] as const,
};

export const useNotifications = (page = 1, limit = 10, unreadOnly = false) => {
  return useQuery({
    queryKey: notificationKeys.list(page, limit, unreadOnly),
    queryFn: () =>
      notificationService.getNotifications(page, limit, unreadOnly),
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 60000, // Optional polling for unread counts
  });
};
