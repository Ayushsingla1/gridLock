'use client'
import useSocket from "@/hooks/socket"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { cursorPositions, Match, role, typingRecMsg } from "@/types/gameTypes"
import axios from "axios"
import ShowTyping from "./showTyping"
import {AES} from 'crypto-js'
import CryptoJS from "crypto-js"


const paragraph = "Lorem ips dolor sit amet consectetur adipiscing elit."
// const paragraph = "Lorem ips dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."


export default function RenderMatch({
    roomId,
    gameId
}: {
    roomId: string,
    gameId: string
}){
    console.log(process.env.NEXT_ENCRYPTION_SECRET);
    const secretKey = process.env.NEXT_ENCRYPTION_SECRET || "SECRET";
    const url = process.env.NEXT_PUBLIC_WSS_SERVER!
    const socketRef = useRef<WebSocket>(null)
    const userRef = useRef<string>(null);
    const {socket,loading} = useSocket(url, socketRef)
    const {user, isLoaded, isSignedIn} = useUser();
    const router = useRouter();
    const [matchDetails, setMatchDetails] = useState<Match | null>(null);
    const [loadingDetails, setLoadingDetails] = useState<boolean>(true);
    const [user1Positions, setUser1Position] = useState<cursorPositions>({
        currentWord: 0,
        pointerPos: 0,
        prevLetters: 0
    });
    const [user2Positions, setUser2Position] = useState<cursorPositions>({
        currentWord: 0,
        pointerPos: 0,
        prevLetters: 0
    });
    const ep = '/api/v1/getMatchInfo'
    const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_SERVER
    
    useEffect(() => {
        if(isSignedIn){
            axios.get(`${HTTP_URL}${ep}`, {
                params: {
                    roomId
                }
            }).then(res => {
                console.log(res.data);
                if(res.data.success){
                    setMatchDetails(res.data.roomDetails);
                }
            }).finally(() => {
                setLoadingDetails(false)
            })
        }
    }, [isSignedIn])


    useEffect(() => {
        if(isLoaded){
            if(!isSignedIn){
                console.log('not Signed In');
                router.push('/auth');
            }else{
                userRef.current = user.username;
                if(socketRef.current){
                    const socketMsg = {
                        role: role.Spectator,
                        gameId,
                        challengeId: roomId,
                        msg: "Join Room",
                        userId: userRef.current
                    }
                    const encryptedMsg = AES.encrypt(JSON.stringify(socketMsg), secretKey).toString();
                    socketRef.current.send(encryptedMsg)            
                }
            }
        }
    }, [socketRef, isLoaded, loading, socket])

    if(socketRef.current){
        socketRef.current.onmessage = (ev: MessageEvent) => {
            const decryptedMsgBytes = AES.decrypt(ev.data, secretKey)
            const decryptedMsg = decryptedMsgBytes.toString(CryptoJS.enc.Utf8);
            const recMsg = JSON.parse(decryptedMsg as string) as typingRecMsg;
            if(recMsg.user == matchDetails?.user1_Id){
                setUser1Position({
                    pointerPos: recMsg.pointerPos,
                    currentWord: recMsg.currentWord,
                    prevLetters: recMsg.prevLetters
                })
            }else if(recMsg.user == matchDetails?.user2_Id){
                setUser2Position({
                    pointerPos: recMsg.pointerPos,
                    currentWord: recMsg.currentWord,
                    prevLetters: recMsg.prevLetters
                })
            }
            if(recMsg.isComplete){
                setLoadingDetails(true);
                axios.get(`${HTTP_URL}${ep}`, {
                    params: {
                        roomId
                    }
                }).then(res => {
                    console.log(res.data);
                    if(res.data.success){
                        setMatchDetails(res.data.roomDetails);
                    }
                }).finally(() => {
                    setLoadingDetails(false)
                })
            }
        }
    }

    if(loadingDetails){
        return <div className="text-3xl font-bold font-mono text-center">loading...</div>
    }

    if(matchDetails?.winnerId != null){
        return <div className="text-3xl font-bold font-mono text-center">Match Winner: {matchDetails.winnerId}</div>
    }

    return <div className="w-full h-full flex flex-col gap-y-5 p-3">
        <div className="flex flex-col w-full items-center justify-center gap-y-2">
            <div className="text-3xl font-bold font-mono">{matchDetails?.user1_Id}</div>
            <ShowTyping userIdx={0}  position={user1Positions} paragraph={paragraph}/>
        </div>

        <div className="flex w-full flex-col justify-center items-center">
            <div className="text-3xl font-bold font-mono">{matchDetails?.user2_Id}</div>
            <ShowTyping userIdx={1}  position={user2Positions} paragraph={paragraph}/>
        </div>
    </div>
}