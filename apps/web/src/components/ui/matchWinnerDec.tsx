import { Match } from "@/types/gameTypes";
import { Trophy } from "lucide-react";
import {motion} from 'motion/react';
import { ReactNode } from "react";

export default function MatchWinnerDec({
    matchDetails
}: {
    matchDetails: Match | null
})  {
    return <div className="bg-black-900 text-slate-200 h-full mt-12 flex justify-center items-center">
        <motion.div
            className="flex flex-col items-center gap-6 p-10 bg-slate-800/50 rounded-2xl shadow-2xl"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
        >
            <Trophy className="h-24 w-24 text-yellow-400" />
            <h1 className="text-xl font-mono text-slate-400">Match Over!</h1>
            <div className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                {matchDetails?.winnerId}
            </div>
            <p className="text-2xl font-semibold">is the winner!</p>
        </motion.div>
    </div>
}