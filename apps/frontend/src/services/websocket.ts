import { io, Socket } from 'socket.io-client';
import { getWsToken } from '@/features/auth/services/auth.service';

class WebSocketService {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

    async connect(): Promise<Socket> {
        try {
            // Get fresh WebSocket token from backend
            const { token } = await getWsToken();

            // Connect to WebSocket with token
            this.socket = io('http://localhost:3000', {
                auth: {
                    token,
                },
                transports: ['websocket', 'polling'],
                withCredentials: true,
            });

            this.setupEventHandlers();

            return this.socket;
        } catch (error) {
            console.error('WebSocket connection failed:', error);
            throw error;
        }
    }

    private setupEventHandlers() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('✅ WebSocket connected');
            this.reconnectAttempts = 0;
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ WebSocket disconnected:', reason);

            // Auto-reconnect for certain disconnect reasons
            if (reason === 'io server disconnect') {
                // Server initiated disconnect, don't reconnect
                return;
            }

            this.scheduleReconnect();
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ WebSocket connection error:', error.message);

            if (error.message.includes('Authentication')) {
                // Token expired or invalid, try to get new token
                this.handleAuthError();
            } else {
                this.scheduleReconnect();
            }
        });
    }

    private async handleAuthError() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;

        try {
            // Get a fresh WebSocket token
            const { token: newToken } = await getWsToken();

            if (newToken && this.socket) {
                this.socket.auth = { token: newToken };
                this.socket.connect();
            }
        } catch (error) {
            console.error('Failed to refresh WebSocket token:', error);
            this.scheduleReconnect();
        }
    }

    private scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);

        setTimeout(async () => {
            try {
                await this.connect();
            } catch (error) {
                console.error('Reconnection failed:', error);
            }
        }, delay);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.reconnectAttempts = 0;
    }

    getSocket(): Socket | null {
        return this.socket;
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

export const webSocketService = new WebSocketService();