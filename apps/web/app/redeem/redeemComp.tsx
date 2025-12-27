"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Gamepad2, Ticket } from "lucide-react";
import { redeemAmount } from "../../utils/functions";
import { useAccount } from "wagmi";

export default function RedeemComp() {
  const [redeemCode, setRedeemCode] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const { address } = useAccount();

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (redeemCode.trim() === "") {
      setStatus({ message: "Please enter a valid code.", type: "error" });
      return;
    }

    setStatus({ message: "Redeeming your code...", type: "loading" });

    try {
      if (!address) {
        setStatus({ message: "Wallet not connected", type: "error" });
        return;
      }
      const result = await redeemAmount(redeemCode.trim().toLowerCase());
      // const
      if (result.success) {
        setStatus({
          message: "Success! Your reward has been claimed.",
          type: "success",
        });
      } else {
        setStatus({
          message: "Invalid code. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
      setStatus({ message: "something went wrong", type: "error" });
    }
  };

  const StatusMessage = () => {
    if (!status.message) return null;

    const colorClasses: any = {
      error: "text-red-400",
      success: "text-green-400",
      loading: "text-blue-400",
    };

    return (
      <motion.p
        key={status.message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`mt-4 text-center text-sm ${colorClasses[status.type] || "text-gray-400"}`}
      >
        {status.message}
      </motion.p>
    );
  };

  return (
    <main className="flex items-center justify-center h-[90%] bg-gray-950 text-gray-100 font-sans p-4 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-gray-950 via-gray-950/80 to-black"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md p-8 space-y-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="inline-block p-3 bg-cyan-500/10 rounded-full mb-4"
          >
            <Gamepad2 className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300">
            Redeem Your Code
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Enter your game ID or special code below to claim your reward.
          </p>
        </div>

        <form onSubmit={handleRedeem} className="space-y-6">
          <div className="relative">
            <label htmlFor="redeem-code" className="sr-only">
              Redeem Code
            </label>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Ticket className="w-5 h-5 text-gray-500" />
            </div>
            <input
              id="redeem-code"
              type="text"
              value={redeemCode}
              onChange={(e) => {
                setRedeemCode(e.target.value);
                setStatus({ message: "", type: "" });
              }}
              placeholder="ENTER MATCH ID"
              className="w-full pl-10 pr-4 py-3 text-lg bg-gray-800/60 border-2 border-gray-700 rounded-lg text-cyan-300 placeholder-gray-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              autoComplete="off"
            />
          </div>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(45, 212, 191, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-lg font-bold text-gray-900 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg shadow-lg cursor-pointer transition-transform duration-200 ease-in-out hover:from-cyan-300 hover:to-teal-300 focus:outline-none focus:ring-4 focus:ring-cyan-300/50"
            disabled={status.type === "loading"}
          >
            {status.type === "loading" ? "Verifying..." : "Redeem Now"}
            {status.type !== "loading" && <ArrowRight className="w-6 h-6" />}
          </motion.button>
        </form>

        <StatusMessage />
      </motion.div>
    </main>
  );
}
