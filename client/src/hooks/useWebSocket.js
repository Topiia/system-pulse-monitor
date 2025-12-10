import { useState, useEffect, useRef } from 'react';

const SOCKET_URL = 'ws://localhost:8765';

export const useWebSocket = () => {
    const [data, setData] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeout = useRef(null);
    const socketRef = useRef(null);

    const connect = () => {
        socketRef.current = new WebSocket(SOCKET_URL);

        socketRef.current.onopen = () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
        };

        socketRef.current.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data);
                setData(parsedData);
            } catch (e) {
                console.error('Error parsing WebSocket message:', e);
            }
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket disconnected. Reconnecting...');
            setIsConnected(false);
            reconnectTimeout.current = setTimeout(connect, 3000); // Reconnect after 3s
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            socketRef.current.close();
        };
    };

    useEffect(() => {
        connect();
        return () => {
            if (socketRef.current) socketRef.current.close();
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
        };
    }, []);

    return { data, isConnected };
};
