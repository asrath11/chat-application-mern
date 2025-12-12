import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { webSocketService } from '@/services/websocket';
import { useAuth } from '@/app/providers/AuthContext';

export const useWebSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, user } = useAuth();
    const connectionAttempted = useRef(false);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            // Clean up if not authenticated
            if (socket) {
                webSocketService.disconnect();
                setSocket(null);
                setIsConnected(false);
                connectionAttempted.current = false;
            }
            return;
        }

        if (connectionAttempted.current) {
            return;
        }

        const connectWebSocket = async () => {
            try {
                connectionAttempted.current = true;
                setError(null);

                const socketInstance = await webSocketService.connect();
                setSocket(socketInstance);

                // Listen for connection status
                socketInstance.on('connect', () => {
                    setIsConnected(true);
                    setError(null);
                });

                socketInstance.on('disconnect', () => {
                    setIsConnected(false);
                });

                socketInstance.on('connect_error', (err) => {
                    setError(err.message);
                    setIsConnected(false);
                });

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Connection failed');
                setIsConnected(false);
                connectionAttempted.current = false;
            }
        };

        connectWebSocket();

        // Cleanup on unmount
        return () => {
            webSocketService.disconnect();
            setSocket(null);
            setIsConnected(false);
            connectionAttempted.current = false;
        };
    }, [isAuthenticated, user]);

    const reconnect = async () => {
        try {
            setError(null);
            const socketInstance = await webSocketService.connect();
            setSocket(socketInstance);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Reconnection failed');
        }
    };

    return {
        socket,
        isConnected,
        error,
        reconnect,
        disconnect: () => {
            webSocketService.disconnect();
            setSocket(null);
            setIsConnected(false);
            connectionAttempted.current = false;
        },
    };
};