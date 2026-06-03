import { SocketClient } from "../core/SocketClient";

export class PresenceSocket {
  constructor(private client: SocketClient) {}

  // --- Emits ---
  requestCurrentOnlineStatuses() {
    if (this.client.connected) {
      console.log("📡 Requesting current online statuses...");
      this.client.emit("request_online_statuses");
    } else {
      console.warn("⚠️ Cannot request statuses: Socket not connected");
    }
  }

  // --- Listeners ---
  onUserStatusChange(callback: (data: any) => void) {
    this.client.on("user_status_change", callback);
  }

  onGlobalUserStatusChange(
    callback: (data: { userId: string; isOnline: boolean }) => void,
  ) {
    this.client.on("global_user_status_change", callback);
  }

  onCurrentOnlineStatuses(
    callback: (statuses: Record<string, boolean>) => void,
  ) {
    this.client.on("current_online_statuses", callback);
  }

  onGlobalOnlineStatuses(
    callback: (statuses: Record<string, boolean>) => void,
  ) {
    this.client.on("global_online_statuses", callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.client.off(event, callback);
  }
}
