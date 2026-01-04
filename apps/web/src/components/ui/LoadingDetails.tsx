import { Loader } from "lucide-react";
import { motion } from "motion/react";

export default function LoadingDetails() {
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
  );
}
