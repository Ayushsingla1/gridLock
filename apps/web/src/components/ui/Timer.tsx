"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Swords } from "lucide-react";
import { useRouter } from "next/navigation";

const TimeUnit = ({ value, label }: { value: number; label: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-slate-800/70 border border-slate-700 rounded-xl w-24 h-24 flex items-center justify-center shadow-lg overflow-hidden backdrop-blur-sm">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            className="absolute text-5xl font-mono font-bold text-indigo-400"
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -25, opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.4 }}
          >
            {value.toString().padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-3">
        {label}
      </span>
    </div>
  );
};

export default function CountdownTimer({ time }: { time: number }) {
  const [timeRem, setTimeRem] = useState<number>(0);
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => {
      const currtimeSec = Math.floor(new Date(Date.now()).getTime() / 1000);
      setTimeRem(time - currtimeSec > 0 ? time - currtimeSec : 0);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  const [days, setDays] = useState<number>(0);
  const [hour, setHour] = useState<number>(0);
  const [min, setMin] = useState<number>(0);
  const [sec, setSec] = useState<number>(0);

  useEffect(() => {
    const d = Math.floor(timeRem / (3600 * 24));
    const timeRemDay = timeRem - d * 3600 * 24;
    const hr = Math.floor(timeRemDay / 3600);
    const timeRemHr = timeRemDay - hr * 3600;
    const mn = Math.floor(timeRemHr / 60);
    const timeRemMn = timeRemHr - mn * 60;
    const sc = Math.floor(timeRemMn);
    setDays(d);
    setHour(hr);
    setMin(mn);
    setSec(sc);
  }, [timeRem]);

  return (
    <main className="bg-black-900 h-10/12 w-full flex flex-col justify-center items-center text-white p-4">
      <motion.div
        className="text-center flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="flex items-center justify-center gap-3 text-2xl font-semibold text-slate-300 mb-8">
          <Swords className="h-7 w-7 text-indigo-400" />
          Match Begins In
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <TimeUnit value={days} label="Days" />
          <TimeUnit value={hour} label="Hours" />
          <TimeUnit value={min} label="Minutes" />
          <TimeUnit value={sec} label="Seconds" />
        </div>
      </motion.div>
    </main>
  );
}
