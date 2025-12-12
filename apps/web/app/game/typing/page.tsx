'use client'
import RenderParagrah from "../../../src/components/game/typing/player/renderParagraph"
import { useEffect, useRef, useState } from 'react'
import useSocket from "../../../src/hooks/socket";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

const paragraph = "Lorem ips dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."

export type message = {
    role : "Player" | "Spectator",
    gameId : string,
    challengeId : string,
    msg : string,
    userId : string,
    password? : string
}

export default function typing() {
    const challengeId = '1'; // for now hardcoded, get this from params ig
    const gameId = '1'; //get from params
    const [pointerPos, setPointerPos] = useState<number>(0);
    const [currentWord, setCurrentWord] = useState<number>(0);
    const [prevLetters, setPrevLetter] = useState<number>(0);
    const pointerRef = useRef(0); 
    const wordRef = useRef(0);
    const prevLettersRef = useRef(0);
    const {user, isLoaded, isSignedIn} = useUser();
    const [para, setPara] = useState<string>(paragraph);
    // put this in env
    const WSS_URL = process.env.NEXT_PUBLIC_WSS_SERVER;
    const url = `${WSS_URL}`;

    const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_SERVER;

    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const socketRef = useRef<WebSocket>(null);
    const {socket, loading} = useSocket(url, socketRef);

    useEffect(() => {
        if(isLoaded){
            if(!isSignedIn){
                console.log('not Signed In')
                router.push('/');
            }
        }
    }, [isLoaded])

    useEffect(() => {
        if(!loading && socket && user && user?.username){
            const socketMsg: message = {
                role: "Player",
                challengeId: challengeId, 
                gameId: gameId,
                msg: "Join Room",
                userId: user.username,
            }
            socket.send(JSON.stringify(socketMsg));
        }

    }, [loading, user, socket])

    // useEffect(() => {
    //     if(gameId) {
    //         axios.get(`${HTTP_URL}/room/getMatchInfo`).then(result => {
    //             if(result.data.success){
    //                 console.log(result);
    //                 setPara(result.data.roomDetails.roomDetails.gameText);
    //             }
    //         })
    //     }
    // },[gameId])

    useEffect(() => {
        canvasRef.current = document.createElement("canvas");
    }, []);

    useEffect(() => {
        const activeWordElement = document.getElementById("word-active");
        if (!activeWordElement || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        ctx.font = "18px monospace"; 

        const wordText = activeWordElement.textContent ?? "";
        const typedSoFar = pointerPos - prevLetters - currentWord; 
        const substring = wordText.slice(0, typedSoFar);
        const offsetX = ctx.measureText(substring).width;
        const rect = activeWordElement.getBoundingClientRect();
        const containerRect = activeWordElement.offsetParent?.getBoundingClientRect();
        const left = rect.left - (containerRect?.left ?? 0) + offsetX;
        const top = rect.top - (containerRect?.top ?? 0);

        const cursor = document.getElementById("caret");

        if (cursor) {
            cursor.style.left = `${left - 2}px`;
            cursor.style.top = `${top}px`;
        }
    }, [pointerPos, currentWord, prevLetters]);

    useEffect(() => {
        pointerRef.current = pointerPos;
    }, [pointerPos])
    
    useEffect(() => {
        wordRef.current = currentWord;
    }, [currentWord])

    useEffect(() => {
        prevLettersRef.current = prevLetters;
    }, [prevLetters])

    const keyPressHandeler = (e: KeyboardEvent) => {
        const activeWordElement = document.getElementById('word-active');
        console.log(activeWordElement);
        console.log(activeWordElement?.textContent!.length);
        console.log(activeWordElement?.getBoundingClientRect());
        console.log(e.key);
        if(e.key == paragraph[pointerRef.current]){
            if(e.key == ' '){
                console.log(activeWordElement?.textContent);
                const wordLen = activeWordElement?.textContent!.length;
                console.log(wordLen);
                setCurrentWord(prev => prev + 1);
                setPrevLetter(prev => prev + (wordLen ?? 0));
            }
            console.log(e.key)
            setPointerPos(p => p += 1);
        }
    }

    useEffect(() => {
        document.addEventListener('keypress', keyPressHandeler)
        
        return () => {
            document.removeEventListener('keypress', keyPressHandeler);
        } 
    }, [])

    return <div className="text-2xl flex justify-center items-center h-screen w-screen">
        <div className="text-2xl w-8/12 h-6/12 relative rounded-lg p-4">
            <div
            id="caret"
            className={`absolute h-[28px] bg-amber-300 w-[2px] rounded-full`}
            ></div>
            <div className="">
                <RenderParagrah 
                    paragraph={paragraph}
                    prevLetters={prevLetters} 
                    currentWord={currentWord}
                    pointerPos={pointerPos}
                />
            </div>
        </div>
    </div>
}