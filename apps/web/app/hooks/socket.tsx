'use client'

import { useState, useEffect } from "react";

export default function useSocket (url: string) {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    
    useEffect(() => {
        const newSocket = new WebSocket(url);

        setSocket(newSocket);
        
        newSocket.onopen = (ev: Event) => {
            console.log('[connection established]');
        }
        
        return () => newSocket.close();
    })

    return socket;
}