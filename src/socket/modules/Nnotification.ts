import { SocketClient } from "../core/SocketClient";

import { INotification } from "@/src/features/notification/types";

export class NotificationSocket {
  constructor(private client: SocketClient) {}

  onNotificationReceived(callback: (notification: INotification) => void) {
    this.client.on("notification:received", callback);
  }

  offNotificationReceived(callback?: (...args: any[]) => void) {
    this.client.off("notification:received", callback);
  }
}
