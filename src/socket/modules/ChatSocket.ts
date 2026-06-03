import { SocketClient } from "../core/SocketClient";

export class ChatSocket {
  constructor(private client: SocketClient) {}

  // --- Emits ---
  joinChat(chatId: string) {
    this.client.emit("join_chat", { chatId });
  }

  joinDirectChat(chatId: string) {
    this.client.emit("join_direct_chat", { chatId });
  }

  joinGroupChat(chatId: string) {
    this.client.emit("join_group_chat", { chatId });
  }

  joinChannelChat(chatId: string) {
    this.client.emit("join_channel_chat", { chatId });
  }

  // --- Listeners ---
  onJoinedChat(callback: (data: any) => void) {
    this.client.on("joined_chat", callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.client.off(event, callback);
  }
}
