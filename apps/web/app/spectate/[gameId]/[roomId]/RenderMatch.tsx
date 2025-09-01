'use client'
import useSocket from "@/hooks/socket"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { cursorPositions, Match, role, typingRecMsg } from "@/types/gameTypes"
import axios from "axios"
import ShowTyping from "./showTyping"


const paragraph = "Lorem ips dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."


export default function RenderMatch({
    roomId,
    gameId
}: {
    roomId: string,
    gameId: string
}){
    const url = "ws://localhost:8080"
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
    
    useEffect(() => {
        axios.get(`http://localhost:3001${ep}`, {
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
    }, [])


    useEffect(() => {
        if(isLoaded){
            if(!isSignedIn){
                console.log('not Signed In');
                router.push('/auth');
            }else{
                console.log(user.username);
                userRef.current = user.username;
                if(socketRef.current){
                    socketRef.current.send(JSON.stringify({
                        role: role.Spectator,
                        gameId,
                        challengeId: roomId,
                        msg: "Join Room",
                        userId: userRef.current
                    }))            
                }
            }
        }
    }, [socketRef, isLoaded, loading, socket])

    if(socketRef.current){
        socketRef.current.onmessage = (ev: MessageEvent) => {
            const recMsg = JSON.parse(ev.data) as typingRecMsg;
            console.log(recMsg);
            if(recMsg.user == matchDetails?.user1_Id){
                setUser1Position({
                    pointerPos: recMsg.pointerPos,
                    currentWord: recMsg.currentWord,
                    prevLetters: recMsg.prevLetters
                })
            }else if(recMsg.user == matchDetails?.user2_Id){
                console.log('recieved')
                setUser2Position({
                    pointerPos: recMsg.pointerPos,
                    currentWord: recMsg.currentWord,
                    prevLetters: recMsg.prevLetters
                })
            }
        }
    }

    if(loadingDetails){
        return <div className="text-3xl font-bold font-mono text-center">loading...</div>
    }

    return <div className="w-full h-full flex flex-col gap-y-5 p-3">
        <div className="flex flex-col w-full items-center justify-center gap-y-2">
            <div className="text-3xl font-bold font-mono">{matchDetails?.user1_Id}</div>
            <ShowTyping userIdx={0} username={matchDetails?.user1_Id!} position={user1Positions} paragraph={paragraph}/>
        </div>

        <div className="flex w-full flex-col justify-center items-center">
            <div className="text-3xl font-bold font-mono">{matchDetails?.user2_Id}</div>
            <ShowTyping userIdx={1} username={matchDetails?.user2_Id!} position={user2Positions} paragraph={paragraph}/>
        </div>
    </div>
}