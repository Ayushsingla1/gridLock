'use client'
import RenderParagrah from "@/components/game/typing/player/RenderPragraph"
import { useEffect, useRef, useState } from 'react'
import useSocket from "@/hooks/socket";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {AES} from 'crypto-js'
import { role } from "@/types/gameTypes";

const paragraph = "Lorem ips dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."

export type message = {
    role : role,
    gameId : string,
    challengeId : string,
    msg : string,
    userId : string,
    password? : string
}

interface gameLogicProps {
    roomId: string,
    gameId: string
}

export default function GameLogic({roomId, gameId}: gameLogicProps) {
    console.log(process.env.NEXT_ENCRYPTION_SECRET)
    const secretKey = process.env.ENCRYPTION_SECRET || "SECRET";
    const [pointerPos, setPointerPos] = useState<number>(0);
    const [currentWord, setCurrentWord] = useState<number>(0);
    const [prevLetters, setPrevLetter] = useState<number>(0);
    const userRef = useRef<string>(null);
    const pointerRef = useRef(0); 
    const wordRef = useRef(0);
    const prevLettersRef = useRef(0);
    const {user, isLoaded, isSignedIn} = useUser();
    const socketRef = useRef<WebSocket>(null);

    const WSS_URL = process.env.NEXT_PUBLIC_WSS_SERVER
    const url = `${WSS_URL}`
    const {socket, loading} = useSocket(url, socketRef);

    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if(isLoaded){
            if(!isSignedIn){
                console.log('not Signed In')
                router.push('/auth');
            }else{
                console.log(user.username);
                userRef.current = user.username;
                if(!loading && socket && user && user?.username){
                    const socketMsg: message = {
                        role: role.Player,
                        challengeId: roomId, 
                        gameId: gameId,
                        msg: "Join Room",
                        userId: user.username,
                    }
                    const encryptedJoinMsg = AES.encrypt(JSON.stringify(socketMsg), secretKey).toString();
                    socket.send(encryptedJoinMsg);
                }
            }
        }

    }, [loading, user, socket, isLoaded])

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
        e.preventDefault();
        if (!socketRef.current && !userRef.current) return;
        console.log(userRef.current);
        const activeWordElement = document.getElementById('word-active');
        let tempPointerPos = pointerRef.current;
        let tempPrevLetters = prevLettersRef.current;
        let tempCurrentWord = wordRef.current;
        if(e.key == paragraph[pointerRef.current]){
            if(e.key == ' '){
                const wordLen = activeWordElement?.textContent.length;
                setCurrentWord(prev => prev + 1);
                setPrevLetter(prev => prev + (wordLen ?? 0));
                tempCurrentWord += 1;
                tempPrevLetters += wordLen ?? 0;
            }
            setPointerPos(p => p += 1);
            tempPointerPos += 1;

            const socketMsg = {
                role: role.Player,
                gameId,
                challengeId: roomId,
                msg: JSON.stringify({
                    pointerPos: tempPointerPos,
                    prevLetters: tempPrevLetters,
                    currentWord: tempCurrentWord, 
                }),
                userId: userRef.current 
            }
            const encryptedMsg = AES.encrypt(JSON.stringify(socketMsg), secretKey).toString();
            socketRef.current?.send(encryptedMsg);
        }
    }

    useEffect(() => {
        document.addEventListener('keypress', keyPressHandeler)
        
        return () => {
            document.removeEventListener('keypress', keyPressHandeler);
        } 
    }, [])

    return <div className="text-2xl mt-[100px] flex justify-self-center justify-center items-center w-full h-full">
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