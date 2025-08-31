'use client'

import { useState, useEffect } from "react";

export default function useSocket (url: string) {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const newSocket = new WebSocket(url);

        setSocket(newSocket);
        
        newSocket.onopen = (ev: Event) => {
            console.log('[connection established]');
        }
        setLoading(false);
        
        return () => newSocket.close();
    }, [])

    return {socket, loading};
}