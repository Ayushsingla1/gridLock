'use client'
import Nav from "@/components/ui/nav";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import RegisteredGames from "@/components/ui/RegisteredGames";


export default function MyGames() {
    const ep = '/api/v1/getMatches'
    const {user} = useUser();
    const [challengesSent, setChallengesSent] = useState<any>();
    const [challengesRec, setChallengesRec] = useState<any>();

    useEffect(() => {
        if(user){
            axios.get(`http://localhost:3001${ep}`, {
                params: {
                    username: user?.username    
                }
            }).then((res) => {
                setChallengesSent(res.data.data.challengesSent)
                setChallengesRec(res.data.data.challengesRecieved)
                console.log(res.data);
            })
        }else{
            console.log('user not loaded');
            return;
        }
    }, [user])

    return <div className="min-h-screen">
        <Nav/>

        <RegisteredGames sentMatches={challengesSent} recMatches={challengesRec}/>
    </div>
}