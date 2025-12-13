// lib/socket.js
import { io, type Socket } from 'socket.io-client';
import type { ListenEvents, EmitEvents } from '@chat-app/shared-types';

class SocketService {
  private socket: Socket<ListenEvents, EmitEvents> | null = null;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private token: string | undefined;
  private listenersInitialized = false;

  constructor() { }

  connect(token: string | undefined) {
    // Validate environment variable
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    if (!socketUrl) {
      console.error('❌ VITE_SOCKET_URL is not defined in .env file');
    }

    // Handle token changes - if token changed while connected, reconnect
    if (this.socket?.connected && this.token !== token) {
      this.token = token;
      this.socket.auth = { token };
      this.socket.disconnect().connect();
      return this.socket;
    }

    this.token = token;

    // If already connected with same token, return existing socket
    if (this.socket?.connected) return this.socket;

    // If socket exists but disconnected, update auth and reconnect
    if (this.socket && !this.socket.connected) {
      this.socket.auth = { token: this.token };
      this.socket.connect();
      return this.socket;
    }

    // Create new socket instance
    this.socket = io(socketUrl, {
      auth: { token: this.token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      transports: ['websocket', 'polling'],
    }) as Socket<ListenEvents, EmitEvents>;

    // Only setup internal listeners once
    if (!this.listenersInitialized) {
      this.setupEventListeners();
      this.listenersInitialized = true;
    }

    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // // These are internal listeners for logging/debugging
    // this.socket.on('connect', () => {
    //   console.log('🟢 Socket Connected:', this.socket?.id);
    // });

    // this.socket.on('disconnect', (reason) => {
    //   console.log('🔴 Socket Disconnected:', reason);
    // });

    // this.socket.on('connect_error', (error) => {
    //   console.error('⚠️ Connection Error:', error.message);
    // });
  }

  emit(event: string, data?: any): boolean {
    if (!this.socket || !this.socket.connected) {
      console.warn('⚠️ Socket not connected. Cannot emit:', event);
      return false;
    }
    this.socket.emit(event as any, data);
    return true;
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event as any, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event as any, callback);
  }

  disconnect() {
    if (!this.socket) return;

    this.socket.disconnect();
    this.socket = null;
    this.listenersInitialized = false;
  }

  isConnected() {
    return Boolean(this.socket?.connected);
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
