import { SocketClient } from "../core/SocketClient";

export class MessageSocket {
  constructor(private client: SocketClient) {}

  // --- Emits ---
  sendMessage(chatId: string, content: string) {
    this.client.emit("send_message", { chatId, content });
  }

  sendDirectMessage(chatId: string, content: string) {
    this.client.emit("send_direct_message", { chatId, content });
  }

  sendGroupMessage(chatId: string, content: string) {
    this.client.emit("send_group_message", { chatId, content });
  }

  sendChannelMessage(chatId: string, content: string) {
    this.client.emit("send_channel_message", { chatId, content });
  }

  markAsRead(messageIds: string[]) {
    this.client.emit("mark_as_read", { messageIds });
  }

  // --- Listeners ---
  onNewMessage(callback: (message: any) => void) {
    this.client.on("new_message", callback);
  }

  onNewDirectMessage(callback: (message: any) => void) {
    this.client.on("new_direct_message", callback);
  }

  onNewGroupMessage(callback: (message: any) => void) {
    this.client.on("new_group_message", callback);
  }

  onNewChannelMessage(callback: (message: any) => void) {
    this.client.on("new_channel_message", callback);
  }

  onMessageRead(callback: (data: any) => void) {
    this.client.on("message_read", callback);
  }

  onMessagesRead(callback: (data: any) => void) {
    this.client.on("messages_read", callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.client.off(event, callback);
  }
}
