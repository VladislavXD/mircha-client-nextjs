import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

import { INotification } from "../types";

import socketService from "@/src/socket/socketService";

export const useRealtimeNotificationsListener = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNotification = (notification: INotification) => {
      toast(notification.message, {
        description: "только что",
      });

      // Invalidate the notifications query to fetch the latest notifications
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unreadCount"],
      });
      queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
    };

    socketService.onNotificationReceived(handleNotification);

    return () => {
      socketService.offNotificationReceived(handleNotification);
    };
  }, [queryClient]);
};
