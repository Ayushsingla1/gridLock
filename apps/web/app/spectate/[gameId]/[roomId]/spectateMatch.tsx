'use client'
import { useEffect, useRef, useState } from "react"
import RenderMatch from "@/components/game/typing/Spectators/RenderMatch";
import { Match, role } from "@/types/gameTypes";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import useSocket from "@/hooks/socket";
import { AES } from "crypto-js";
import { Loader, Trophy } from "lucide-react";
import {motion} from 'motion/react'
import BettingPanel from "@/components/game/Betting/BettingPanel";
import Timer from "@/components/ui/Timer";
import NoMatchFound from "@/components/ui/noMatchFound";
import MatchOngoingStatus from "@/components/ui/noWinner";

export default function SpectateMatch({
    roomId,
    gameId
}: {
    roomId: string,
    gameId: string
}) {
    const [loadingDetails, setLoadingDetails] = useState<boolean>(true);
    const [matchDetails, setMatchDetails] = useState<Match | null>(null);
    const userRef = useRef<string>(null);
    const {user, isLoaded, isSignedIn} = useUser();
    const router = useRouter();
    const ep = '/api/v1/getMatchInfo'
    const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_SERVER
    const secretKey = process.env.NEXT_ENCRYPTION_SECRET || "SECRET";
    const url = process.env.NEXT_PUBLIC_WSS_SERVER!
    const socketRef = useRef<WebSocket>(null)
    const {socket,loading} = useSocket(url, socketRef)
    
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
            }).catch((error) => {
                setMatchDetails(null);
                setLoadingDetails(false);
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


     if (loadingDetails) {
        return (
            <div className="bg-black text-slate-200 min-h-screen flex flex-col justify-center items-center gap-4">
                <Loader className="h-12 w-12 animate-spin text-indigo-400" />
                <motion.div
                    className="text-2xl font-semibold font-mono tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Loading Match...
                </motion.div>
            </div>
        )
    }


    if(!matchDetails){
        return <NoMatchFound/> 
    }

    let timeRem = Math.floor(new Date(matchDetails?.ExpiresAt).getTime() / 1000);

    if(timeRem + 3600 < Math.floor(new Date(Date.now()).getTime() / 1000) && matchDetails.winnerId == null){
        return <MatchOngoingStatus/> 
    }

    if(matchDetails && new Date(matchDetails?.ExpiresAt).getTime() > new Date(Date.now()).getTime()){
        return <Timer time={timeRem}/>
    }

    if (matchDetails?.winnerId != null) {
        return (
            <div className="bg-black-900 text-slate-200 h-full mt-12 flex justify-center items-center">
                <motion.div
                    className="flex flex-col items-center gap-6 p-10 bg-slate-800/50 rounded-2xl shadow-2xl"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                >
                    <Trophy className="h-24 w-24 text-yellow-400" />
                    <h1 className="text-xl font-mono text-slate-400">Match Over!</h1>
                    <div className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                        {matchDetails.winnerId}
                    </div>
                    <p className="text-2xl font-semibold">is the winner!</p>
                </motion.div>
            </div>
        )
    }


    return <div className="w-screen h-full flex">
        <main className="bg-black-900 text-slate-200 min-h-screen w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
                <RenderMatch socketRef={socketRef} matchDetails={matchDetails} setMatchDetails={setMatchDetails} setLoadingDetails={setLoadingDetails} roomId={roomId} />
            </div>
            <div className="lg:col-span-5">
                <BettingPanel
                    player1={matchDetails?.user1_Id || 'Player 1'}
                    player2={matchDetails?.user2_Id || 'Player 2'}
                />
            </div>
        </main>
    </div>
}