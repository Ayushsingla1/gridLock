"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "motion/react"; // Note: 'motion/react' is often an alias for 'framer-motion'
import { Zap, Gamepad2, Users, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
// Define a type for a single live match for better type safety
interface LiveMatch {
  id: string;
  gameId: string;
  user1_Id: string;
  user2_Id: string;
}

// Define the props for our component (optional, as it fetches its own data)
interface LiveMatchesProps {}

// Helper function to get the game name from its ID (reused from your template)
const getGameName = (gameId: string) => {
  const gameMap: { [key: string]: string } = {
    "1": "Typing",
    "2": "Chess",
    "3": "Pictionary",
  };
  return gameMap[gameId] || "Unknown Game";
};

// Animation variants for the list container
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation variants for each card item
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function ScheduledMatches(props: LiveMatchesProps) {
  // State for storing matches, loading status, and potential errors
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Endpoint for fetching live matches.
  // For production, this should be in a .env file.
  const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_SERVER;
  const ep = "/api/v1/user/getScheduledMatches";
  const API_ENDPOINT = `${HTTP_URL}${ep}`;

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const response = await axios.get(API_ENDPOINT);
        console.log(response.data.result);
        setMatches(response.data.result);
      } catch (err) {
        console.error("Failed to fetch live matches:", err);
        setError("Could not load live matches. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveMatches();
  }, []); // Empty dependency array ensures this runs once on component mount

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-gray-400">
          <Loader2 className="animate-spin" size={32} />
          <p className="font-semibold">Loading Live Matches...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 px-6 bg-red-900/20 border border-dashed border-red-700/50 rounded-xl">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2 text-red-400">
            An Error Occurred
          </h3>
          <p className="text-red-400/80">{error}</p>
        </div>
      );
    }

    if (matches.length === 0) {
      return (
        <div className="text-center py-16 px-6 bg-gray-900/50 border border-dashed border-gray-700 rounded-xl">
          <Zap className="mx-auto text-primary mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2">
            No Live Matches Right Now
          </h3>
          <p className="text-gray-400">
            It's a bit quiet... Why not start a new match to get the action
            going?
          </p>
        </div>
      );
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {matches.map((match) => (
          <LiveMatchCard key={match.id} match={match} />
        ))}
      </motion.div>
    );
  };

  return (
    <section className="bg-gray-950 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <h1 className="text-4xl font-bold text-center mb-4 text-glow">
            Live Action
          </h1>
          <p className="text-gray-400 text-center mb-12">
            Games currently in progress. Jump in and spectate!
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLoading ? "loading" : "content"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// A separate component for rendering a single live match card
function LiveMatchCard({ match }: { match: any }) {
  const router = useRouter();
  const gameName = match.game.GameName;

  console.log("gn", gameName);

  return (
    <motion.div
      variants={itemVariants}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between glow-hover-card"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg text-glow">{gameName}</h3>
          <span className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-full border bg-red-500/20 text-red-400 border-red-500/30">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            LIVE
          </span>
        </div>
        <div className="space-y-3 text-sm text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-primary" />
            <span>
              <span className="font-medium text-gray-200">
                {match.user1_Id}
              </span>{" "}
              vs.{" "}
              <span className="font-medium text-gray-200">
                {match.user2_Id}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => router.push(`/spectate/${match.gameId}/${match.id}`)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Gamepad2 size={16} /> Spectate Match
        </button>
      </div>
    </motion.div>
  );
}
