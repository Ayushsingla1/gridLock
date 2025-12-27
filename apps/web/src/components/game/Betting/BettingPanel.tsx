"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Ticket,
  Coins,
  CircleDollarSign,
  ArrowRight,
} from "lucide-react";
import { config } from "../../../../utils/wagmiProvider";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import {
  contractABI,
  contractAddress,
  usdContractAddress,
} from "../../../../utils/contractInfo";
import { erc20Abi } from "viem";
import { useAccount } from "wagmi";
import axios from "axios";

const BettingPanel = ({
  player1,
  player2,
  gameId,
  userId,
  matchId,
}: {
  player1: string;
  player2: string;
  gameId: string;
  userId: string;
  matchId: string;
}) => {
  const [estAmt, setEstAmt] = useState<number | string>("");
  const [betShares, setBetShares] = useState<number>(0);
  const [betYes, setBetYes] = useState<boolean>(true);
  const [gameContractDetails, setGameContractDetails] = useState<any>();
  const { address } = useAccount();
  const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_SERVER;
  const ep = "/api/v1/user/stake";

  useEffect(() => {
    getGameFromContract();
  }, []);

  useEffect(() => {
    // getPrice(gameId, betShares, betYes);
    console.log(betYes);
    getPrice(gameId, betShares, betYes);
  }, [betYes]);

  const getPrice = async (gameId: string, amount: number, betYes: boolean) => {
    // console.log(gameId, amount , betYes);
    const res: BigInt = (await readContract(config, {
      abi: contractABI,
      functionName: "getAmount",
      args: [gameId, betYes, BigInt(String(amount))],
      address: contractAddress,
    })) as BigInt;

    // console.log(res);

    // console.log(parseInt(res.toString())/10**12)
    setEstAmt(parseInt(res.toString()) / 10 ** 12);
    return parseInt(res.toString());
  };

  const getEstAmt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // getPrice(gameId, betShares, betYes)
    setBetShares(parseInt(e.target.value));
    getPrice(gameId, parseInt(e.target.value), betYes);
  };

  const getGameFromContract = async () => {
    const res = await readContract(config, {
      abi: contractABI,
      functionName: "getGame",
      args: [gameId],
      address: contractAddress,
    });
    console.log(res);
    setGameContractDetails(res);
    console.log(parseInt((res as any)[6]) / 10 ** 12);
  };

  const purchaseHandler = async () => {
    if (!betShares) return;
    if (!address) {
      alert("no address found");
      return;
    }

    const result = await readContract(config, {
      address: usdContractAddress,
      abi: erc20Abi,
      functionName: "allowance",
      args: [address!, contractAddress],
    });

    const approveAmount = parseInt(result.toString());

    console.log(result);

    const price = await getPrice(gameId, betShares, betYes);
    const finalPrice = Math.ceil(price / 10 ** 6);

    console.log(finalPrice);

    if (approveAmount > finalPrice) {
      await buy(finalPrice);
    } else {
      const allowResult = await writeContract(config, {
        address: usdContractAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [contractAddress, BigInt(finalPrice.toString())],
      });

      const confirmation = await waitForTransactionReceipt(config, {
        hash: allowResult,
      });

      console.log("confirmation for allowance", confirmation);

      if (confirmation) await buy(finalPrice);
    }
  };

  const buy = async (price: number) => {
    const bet = betYes === true;
    console.log(price);
    const res = await writeContract(config, {
      abi: contractABI,
      address: contractAddress,
      functionName: "stakeAmount",
      args: [gameId, betShares, bet, BigInt(price.toString())],
    });

    const confirmation = await waitForTransactionReceipt(config, {
      hash: res,
    });

    if (confirmation) {
      console.log(betShares);
      const _dbConfirmation = await axios.post(`${HTTP_URL}${ep}`, {
        params: {
          userId: userId,
          matchId: matchId,
          bet: bet,
          amountTokens: betShares,
          // userId : user
        },
      });

      if (_dbConfirmation.data.success) alert("success");
      else alert("fail");
    } else alert("fail");
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
        <h2 className="text-2xl font-bold tracking-wide text-slate-100">
          Place Your Bet
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {/* Bet Amount Input */}
        <div>
          <label
            htmlFor="bet-amount"
            className="block text-sm font-medium text-slate-400 mb-2"
          >
            Bet Amount
          </label>
          <div className="relative">
            <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              id="shares"
              type="number"
              value={betShares}
              onChange={getEstAmt}
              placeholder="100"
              className="w-full bg-slate-900/70 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="bet-amount"
            className="block text-sm font-medium text-slate-400 mb-2"
          >
            Bet Amount
          </label>
          <div className="relative">
            <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              id="amount"
              type="number"
              value={estAmt}
              onChange={getEstAmt}
              placeholder="100"
              className="w-full bg-slate-900/70 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>
        </div>

        {/* Player Betting Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <motion.button
            onClick={() => setBetYes(true)}
            className={`${betYes == true ? "border-cyan-500 border-2 " : "border-transparent"} flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-lg border hover:border-cyan-400 duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="h-6 w-6 text-cyan-400" />
            <span className="font-semibold text-cyan-300">
              Bet on {player1}
            </span>
          </motion.button>
          <motion.button
            onClick={() => setBetYes(false)}
            className={`${betYes == false ? `border-pink-700 border-2` : `border-transparent`} flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-lg border hover:border-pink-400 transition-colors duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="h-6 w-6 text-pink-400" />
            <span className="font-semibold text-pink-300">
              Bet on {player2}
            </span>
          </motion.button>
        </div>

        <div className="mt-4">
          <motion.button
            onClick={purchaseHandler}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={!betShares || betShares <= 0} // Disable if no shares are entered
          >
            Place Bet
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Coins className="h-5 w-5" />
          <span className="font-medium">Total Pot</span>
        </div>
        <span className="text-xl font-bold text-amber-400 font-mono">
          {gameContractDetails
            ? `$${parseInt(gameContractDetails[6]) / 10 ** 6}`
            : "$31,000"}
        </span>
      </div>
    </motion.div>
  );
};

export default BettingPanel;
