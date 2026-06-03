import {
  INotification,
  INotificationsResponse,
} from "../types/notificationType";

import { api } from "@/src/api";

class NotificationService {
  async getNotifications(
    page = 1,
    limit = 10,
    unreadOnly = false,
  ): Promise<INotificationsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(unreadOnly ? { unreadOnly: "true" } : {}),
    });

    return await api.get<INotificationsResponse>(
      `notifications?${params.toString()}`,
    );
  }

  async getUnreadCount(): Promise<number> {
    const response = await api.get<{ count: number }>(
      "notifications/unread-count",
    );

    return response.count;
  }

  async markAsRead(id: string): Promise<INotification> {
    return await api.patch<INotification>(`notifications/${id}/read`);
  }

  async markAllAsRead(): Promise<{ updatedCount: number }> {
    return await api.patch<{ updatedCount: number }>("notifications/read-all");
  }
}

export const notificationService = new NotificationService();
