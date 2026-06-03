import { io, Socket } from "socket.io-client";

export class SocketClient {
  private socket: Socket | null = null;
  private isConnected = false;
  private eventListeners: { [event: string]: ((...args: any[]) => void)[] } =
    {};
  private socketListeners: { [event: string]: ((...args: any[]) => void)[] } =
    {};

  private SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3002";

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("🔌 [SocketClient] connect() called");
      console.log(
        "   NEXT_PUBLIC_SOCKET_URL env:",
        process.env.NEXT_PUBLIC_SOCKET_URL,
      );
      console.log("   Using SOCKET_URL:", this.SOCKET_URL);
      console.log("   Already connected:", this.isConnected);

      if (this.socket && this.socket.connected) {
        console.log("✅ Already connected to Socket.IO server");
        this.isConnected = true;
        resolve();

        return;
      }

      if (this.socket && !this.socket.connected) {
        console.log("🧹 Cleaning up old disconnected socket...");
        this.socket.removeAllListeners();
        this.socket = null;
        this.isConnected = false;
      }

      console.log("🔄 Creating new Socket.IO connection....");

      this.socket = io(this.SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        timeout: 20000,
      });

      // Переназначаем все сохраненные пользовательские слушатели из .on()
      if (this.socketListeners) {
        Object.entries(this.socketListeners).forEach(
          ([eventName, callbacks]) => {
            callbacks.forEach((cb) => {
              this.socket?.on(eventName, cb);
            });
          },
        );
      }

      this.socket.on("connect", () => {
        console.log("✅ Connected to Socket.IO server:", this.SOCKET_URL);
        this.isConnected = true;
        this.emitCustom("connect");
        resolve();
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ Socket.IO connection error:", error.message);
        this.isConnected = false;
        this.emitCustom("connect_error", error);
        reject(error);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from server. Reason:", reason);
        this.isConnected = false;
        this.emitCustom("disconnect");
      });

      this.socket.on("reconnect", (attemptNumber) => {
        console.log(`✅ Reconnected after ${attemptNumber} attempts`);
        this.isConnected = true;
        this.emitCustom("reconnect", attemptNumber);
      });

      this.socket.on("reconnect_attempt", (attemptNumber) => {
        console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
      });

      this.socket.on("reconnect_error", (error) => {
        console.error("❌ Reconnection error:", error.message);
      });

      this.socket.on("reconnect_failed", () => {
        console.error("❌ Reconnection failed after all attempts");
        this.isConnected = false;
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  reconnect(): Promise<void> {
    console.log("Reconnecting...");
    this.disconnect();

    return this.connect();
  }

  get connected() {
    return this.isConnected;
  }

  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.socketListeners[event]) {
      this.socketListeners[event] = [];
    }
    this.socketListeners[event].push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socketListeners[event]) return;

    if (callback) {
      this.socketListeners[event] = this.socketListeners[event].filter(
        (cb) => cb !== callback,
      );
      if (this.socket) this.socket.off(event, callback);
    } else {
      delete this.socketListeners[event];
      if (this.socket) this.socket.removeAllListeners(event);
    }
  }

  private emitCustom(event: string, ...args: any[]) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((callback) => callback(...args));
    }
  }

  onCustom(event: string, callback: (...args: any[]) => void) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  offCustom(event: string, callback?: (...args: any[]) => void) {
    if (!this.eventListeners[event]) return;

    if (callback) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        (cb) => cb !== callback,
      );
    } else {
      delete this.eventListeners[event];
    }
  }
}
