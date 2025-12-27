"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import {
  ArrowRightLeft,
  Check,
  Swords,
  Clock,
  X,
  Send,
  Inbox,
  SendIcon,
} from "lucide-react";
import { Match } from "@/types/gameTypes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

// Define a type for a single match for better type safety
// Based on the data structure from your screenshot

// Define the props for our component
interface RegisteredGamesProps {
  sentMatches: Match[];
  recMatches: Match[];
  username: string | null | undefined;
}

// Helper function to get the game name from its ID
const getGameName = (gameId: string) => {
  const gameMap: { [key: string]: string } = {
    "1": "Typing",
    "2": "Chess",
    "3": "Pictionary",
  };
  return gameMap[gameId] || "Unknown Game";
};

// Helper function to get a color class based on the match status
const getStatusColor = (status: Match["status"]) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Scheduled":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Completed":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  }
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

export default function RegisteredGames({
  sentMatches,
  recMatches,
  username,
}: RegisteredGamesProps) {
  const [activeView, setActiveView] = useState<"sent" | "received">("sent");

  const matchesToShow = activeView === "sent" ? sentMatches : recMatches;

  return (
    <section className="bg-gray-950 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <h1 className="text-4xl font-bold text-center mb-4 text-glow">
            Your Matches
          </h1>
          <p className="text-gray-400 text-center mb-8">
            View your pending, accepted, and completed challenges.
          </p>

          {/* Toggle Buttons */}
          <div className="flex justify-center items-center gap-4 mb-10">
            <button
              onClick={() => setActiveView("sent")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 ${
                activeView === "sent"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <Send size={16} />
              Sent Challenges
            </button>
            <button
              onClick={() => setActiveView("received")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 ${
                activeView === "received"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <Inbox size={16} />
              Received Challenges
            </button>
          </div>
        </motion.div>

        {/* Matches List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {matchesToShow && matchesToShow.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {matchesToShow.map((match, index) => (
                  <MatchCard
                    username={username}
                    key={index}
                    match={match}
                    type={activeView}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16 px-6 bg-gray-900/50 border border-dashed border-gray-700 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">
                  {activeView === "sent"
                    ? "No Sent Challenges"
                    : "No Received Challenges"}
                </h3>
                <p className="text-gray-400">
                  {activeView === "sent"
                    ? "You haven't sent any challenges yet. Go to the games page to challenge a friend!"
                    : "You have no pending challenges from other players."}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// A separate component for rendering a single match card
function MatchCard({
  match,
  type,
  username,
}: {
  match: Match;
  type: "sent" | "received";
  username: string | null | undefined;
}) {
  const opponent = type === "sent" ? match.user2_Id : match.user1_Id;
  const gameName = getGameName(match.gameId);
  const formattedDate = new Date(match.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedMatchDate = new Date(match.ExpiresAt).toLocaleString("en-US", {
    // year: 'numeric', month: 'short', day: 'numeric', timeStyle: 'medium'
    timeZone: "IST",
  });
  const { getToken, userId } = useAuth();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if(new Date(match.ExpiresAt).getSeconds < new Date(Date.now()).getSeconds){
  //       await axios.post('')
  //     }
  //   }, 5000)

  // }, [])

  const cancelEp = "/api/v1/user/cancelReq";
  const router = useRouter();
  const ep = `/api/v1/user/acceptChallenge`;
  const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_SERVER;

  if (username == undefined || username == null) {
    router.push("/auth");
  }

  const handleCancel = async () => {
    // const { name } = e.currentTarget;
    const body: {
      userId: string | null | undefined;
      matchId: string;
      username: string | null | undefined;
    } = {
      userId: userId,
      matchId: match.id,
      username: username,
    };
    try {
      const token = await getToken();
      const response = await axios.post(`${HTTP_URL}${cancelEp}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptHandeler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    const body = {
      matchId: match.id,
      isAccepted: name == "accept" ? true : false,
      userId: username,
    };
    try {
      const token = await getToken();
      const response = await axios.post(`${HTTP_URL}${ep}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response.data.success) {
        alert("match accepted!");
      } else {
        alert("something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between glow-hover-card"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-glow">{gameName}</h3>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(match.status)}`}
          >
            {match.status}
          </span>
        </div>
        <div className="space-y-3 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={14} className="text-primary" />
            <span>
              vs. <span className="font-medium text-gray-200">{opponent}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <SendIcon size={14} className="text-primary" />
            <span>Sent on: {formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-primary" />
            <span>Match Date: {formattedMatchDate}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-2">
        {type === "received" && match.status === "Pending" && (
          <>
            <button
              name="accept"
              onClick={acceptHandeler}
              className="flex-1 bg-green-500/80 hover:bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Check size={16} /> Accept
            </button>
            <button
              name="decline"
              onClick={acceptHandeler}
              className="flex-1 bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <X size={16} /> Decline
            </button>
          </>
        )}
        {type === "sent" && match.status === "Pending" && (
          <button
            onClick={handleCancel}
            className="w-full bg-zinc-600/80 hover:bg-zinc-600 text-white px-4 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <X size={16} /> Cancel
          </button>
        )}
        {(match.status === "Scheduled" || match.status === "Completed") && (
          <button
            onClick={() => router.push(`/match/${match.gameId}/${match.id}`)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <Swords size={16} />{" "}
            {match.status === "Completed" ? "View Result" : "Play Match"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
