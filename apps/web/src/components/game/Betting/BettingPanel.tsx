// Create a new file for this component, e.g., components/game/typing/spectators/BettingPanel.tsx
'use client'
import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Ticket, Coins, CircleDollarSign } from 'lucide-react';

const BettingPanel = ({ player1, player2 }: { player1: string, player2: string }) => {
    const [betAmount, setBetAmount] = useState<number | string>('');

    const handleBet = (player: string) => {
        // Your betting logic would go here
        alert(`You bet ${betAmount} on ${player}`);
    };

    return (
        <motion.div
            className="bg-slate-800/50 p-6 rounded-2xl shadow-xl border border-slate-700/50 flex flex-col gap-6 sticky top-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
                <Ticket className="h-8 w-8 text-indigo-400" />
                <h2 className="text-2xl font-bold tracking-wide text-slate-100">Place Your Bet</h2>
            </div>

            <div className="flex flex-col gap-4">
                {/* Bet Amount Input */}
                <div>
                    <label htmlFor="bet-amount" className="block text-sm font-medium text-slate-400 mb-2">Bet Amount</label>
                    <div className="relative">
                        <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <input
                            id="bet-amount"
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                            placeholder="100"
                            className="w-full bg-slate-900/70 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                    </div>
                </div>

                {/* Player Betting Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <motion.button
                        onClick={() => handleBet(player1)}
                        className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-lg border border-transparent hover:border-cyan-400 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <User className="h-6 w-6 text-cyan-400" />
                        <span className="font-semibold text-cyan-300">Bet on {player1}</span>
                    </motion.button>
                    <motion.button
                        onClick={() => handleBet(player2)}
                        className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-lg border border-transparent hover:border-pink-400 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <User className="h-6 w-6 text-pink-400" />
                        <span className="font-semibold text-pink-300">Bet on {player2}</span>
                    </motion.button>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                    <Coins className="h-5 w-5" />
                    <span className="font-medium">Total Pot</span>
                </div>
                <span className="text-xl font-bold text-amber-400 font-mono">
                    $1,250.00 {/* Example Pot */}
                </span>
            </div>
        </motion.div>
    );
};

export default BettingPanel;