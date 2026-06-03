import { SocketClient } from "../core/SocketClient";

export class TypingSocket {
  constructor(private client: SocketClient) {}

  // --- Emits ---
  startTyping(chatId: string) {
    this.client.emit("typing_start", { chatId });
  }

  startTypingDirect(chatId: string) {
    this.client.emit("typing_start_direct", { chatId });
  }

  startTypingGroup(chatId: string) {
    this.client.emit("typing_start_group", { chatId });
  }

  stopTyping(chatId: string) {
    this.client.emit("typing_stop", { chatId });
  }

  stopTypingDirect(chatId: string) {
    this.client.emit("typing_stop_direct", { chatId });
  }

  stopTypingGroup(chatId: string) {
    this.client.emit("typing_stop_group", { chatId });
  }

  // --- Listeners ---
  onTypingStart(callback: (data: any) => void) {
    this.client.on("user_typing_start", callback);
  }

  onTypingStop(callback: (data: any) => void) {
    this.client.on("user_typing_stop", callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.client.off(event, callback);
  }
}
