'use client'

import { Button } from "@/components/ui/button"
import { Gamepad2, Sparkles } from "lucide-react"
import { motion } from "motion/react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function Nav() {
  const router = useRouter() 
  const {user, isLoaded} = useUser()
  useEffect(() => {
    if(isLoaded){
      if(!user){
        router.push('/');
      }else{
        console.log(user?.username);
      }
    }
  }, [isLoaded])
  return (
    <div>
        <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-2 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-glow">GridLock</span>
            </div>
            <div className="flex items-center space-x-4">
              {
              user && <Link href={'/game/myGames'}><Button variant="ghost" className="text-foreground hover:text-black">
                My Games  
              </Button></Link>
              }
              <Button variant="ghost" className="text-foreground hover:text-black">
                About
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-black">
                Games
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-black">
                Leaderboard
              </Button>
              <Button className="glow-hover bg-primary text-primary-foreground">
                <Sparkles className="w-4 h-4 mr-2" />
                Connect X Account
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>
    </div>
  )
}