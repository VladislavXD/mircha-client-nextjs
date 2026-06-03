const fs = require('fs');

const path = '/home/neivo/myCode/mirchan/web/client-next/src/socket/core/SocketClient.ts';
let code = fs.readFileSync(path, 'utf8');

// 1. Add socketListeners dictionary
code = code.replace(
  'private eventListeners: { [event: string]: ((...args: any[]) => void)[] } = {};',
  'private eventListeners: { [event: string]: ((...args: any[]) => void)[] } = {};\n  private socketListeners: { [event: string]: ((...args: any[]) => void)[] } = {};'
);

// 2. Modify connect() to apply socketListeners
const ioSetupStr = `this.socket = io(this.SOCKET_URL, {`;
const applyListenersStr = `      this.socket = io(this.SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000, 
        reconnectionDelayMax: 5000, 
        reconnectionAttempts: 10,
        timeout: 20000,
      });

      // Переназначаем все сохраненные глобальные слушатели
      Object.entries(this.socketListeners).forEach(([eventName, callbacks]) => {
        callbacks.forEach(cb => {
          this.socket?.on(eventName, cb);
        });
      });
`;
// Note: We need a smarter replace for connect() or just use regex.
// Let's rewrite `on` and `off` first.

code = code.replace(
  /on\(event: string, callback: \(\.\.\.args: any\[\]\) => void\) \{\s*if \(this\.socket\) \{\s*this\.socket\.on\(event, callback\);\s*\}\s*\}/g,
  `on(event: string, callback: (...args: any[]) => void) {
    if (!this.socketListeners[event]) {
      this.socketListeners[event] = [];
    }
    this.socketListeners[event].push(callback);
    
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }`
);

code = code.replace(
  /off\(event: string, callback\?: \(\.\.\.args: any\[\]\) => void\) \{\s*if \(this\.socket\) \{\s*this\.socket\.off\(event, callback\);\s*\}\s*\}/g,
  `off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socketListeners[event]) return;

    if (callback) {
      this.socketListeners[event] = this.socketListeners[event].filter(cb => cb !== callback);
      if (this.socket) this.socket.off(event, callback);
    } else {
      delete this.socketListeners[event];
      if (this.socket) this.socket.removeAllListeners(event);
    }
  }`
);

fs.writeFileSync(path, code, 'utf8');
