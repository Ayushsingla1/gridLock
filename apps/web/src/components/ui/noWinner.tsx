import { motion } from "motion/react";
import { Hourglass } from "lucide-react";

const MatchOngoingStatus = () => {
  // Your logic from before, wrapped in a component
  // if (timeRem > Date.now() && matchDetails?.winnerId == null) { ... }

  return (
    <div className="w-full h-11/12 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center max-w-[500px] w-10/12 justify-center gap-6 p-8 bg-slate-900/50 border border-slate-700 rounded-2xl shadow-lg"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Hourglass className="h-12 w-12 text-yellow-400" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white tracking-wide">
            The Match DNF
          </h2>
          <p className="text-slate-400 mt-1">
            A winner has not been decided yet.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MatchOngoingStatus;
