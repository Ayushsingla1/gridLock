'use client'
import axios from 'axios'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Nav from "@/components/ui/nav";
import { ArrowRight, Eye, Send, Wallet, X, AtSign } from "lucide-react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

// Define the type for game names for better type safety
export type GameName = "Typing" | "Chess" | "Pictionary";

// Define the structure for each game object
interface Game {
  id: string;
  name: GameName;
  description: string;
  isAvailable: boolean;
}

const games: Game[] = [
  {
    id: "1",
    name: "Typing",
    description: "Participate in a fast-paced typing competition to see who comes out on top!",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Chess",
    description: "Coming soon...",
    isAvailable: false,
  },
  {
    id: "3",
    name: "Pictionary",
    description: "Coming soon...",
    isAvailable: false,
  },
];

interface gameSelectedProps {
  id: string,
  name: string
}

export default function GamePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState("");
  const [selectedGame, setSelectedGame] = useState<gameSelectedProps | null>(null);

  const router = useRouter();
  const {user, isLoaded} = useUser();

  useEffect(() => {
    if(isLoaded){
      if(!user){
        router.push('/');
      }else{
        console.log(user?.username);
      }
    }
  }, [isLoaded])

  const handleChallengeClick = (gameId: string, gameName: string) => {
    setSelectedGame({
      id: gameId,
      name: gameName
    });
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setTwitterUsername("");
  }
  const postEndPoint = "/api/v1/createMatch"

  const handleSendChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Challenge sent to ${twitterUsername} for the game: ${selectedGame}`);

    // twitter post
    const response = await axios({
      method: 'POST',
      url: `http://localhost:3001${postEndPoint}`,
      data: {
        challenger: "dev_aggarwal03",
        challenged: twitterUsername.toLowerCase(),
        gameId: selectedGame?.id,
        game: selectedGame?.name,
        startTime: new Date(Date.now() + 5*60*1000) // 5min after current hardcoded for now
      }
    })
    console.log(response.data);

    closeModal();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
      },
    },
  };

  const itemVariants : Variants = {
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

  return (
    <div>
      <Nav />
      
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-glow">
                Pick a Game to{" "}
                <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  Compete
                </span>
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="glow-hover bg-primary text-primary-foreground text-lg px-8 py-6 group">
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10 text-lg px-8 py-6 bg-transparent"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Watch Live Games
                </Button>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              >
                {games.map((game) => (
                  <motion.div
                    key={game.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-card/50 flex flex-col justify-between backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center glow-hover-card"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-glow mb-2">{game.name}</h3>
                      <p className="text-sm text-muted-foreground min-h-[40px]">{game.description}</p>
                    </div>
                    <Button
                      id={game.name}
                      onClick={() => handleChallengeClick(game.id, game.name)}
                      size='default'
                      className="mt-4 w-full"
                      disabled={!game.isAvailable}
                    >
                      Challenge a Friend
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modal for sending a challenge */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-card border border-border/50 rounded-xl shadow-2xl p-6 w-full max-w-md relative"
              onClick={(e: any) => e.stopPropagation()}
            >
              <button onClick={closeModal} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                <X size={20}/>
              </button>

              <h2 className="text-2xl font-bold text-center mb-2">Challenge a Player</h2>
              <p className="text-muted-foreground text-center mb-6">Enter your friend's Twitter username to send a challenge for <span className="font-semibold text-primary">{selectedGame?.name}</span>.</p>

              <form onSubmit={handleSendChallenge}>
                <div className="relative mb-4">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    value={twitterUsername}
                    onChange={(e) => setTwitterUsername(e.target.value)}
                    placeholder="twitter_username"
                    className="w-full bg-input border border-border/50 rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                    required
                  />
                </div>
                <Button type="submit" className="w-full group">
                  Send Challenge <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}