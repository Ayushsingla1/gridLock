'use client'

import { useState, useEffect, RefObject } from "react";

export default function useSocket (url: string, socketRef: RefObject<WebSocket | null>) {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const newSocket = new WebSocket(url);

        setSocket(newSocket);
        
        newSocket.onopen = (ev: Event) => {
            console.log('[connection established]');
        }
        socketRef.current = newSocket;
        setLoading(false);
        
        return () => newSocket.close();
    }, [])

    return {socket, loading};
}