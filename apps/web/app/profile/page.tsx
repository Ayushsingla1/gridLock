"use client"

import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Gamepad2, Trophy, Target, Zap, Crown, Clock, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const stats = [
    {
      title: "Games Played",
      value: "127",
      icon: <Gamepad2 className="w-6 h-6" />,
      color: "from-primary/20 to-primary/5",
    },
    {
      title: "Games Won",
      value: "89",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-chart-2/20 to-chart-2/5",
    },
    {
      title: "Games Lost",
      value: "38",
      icon: <Target className="w-6 h-6" />,
      color: "from-chart-3/20 to-chart-3/5",
    },
    {
      title: "Win Rate",
      value: "70%",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-chart-4/20 to-chart-4/5",
    },
  ]

  const ongoingChallenges = [
    {
      opponent: "@sarah_codes",
      game: "Speed Typing",
      status: "Your Turn",
      timeLeft: "2h 15m",
      avatar: "/female-developer.png",
    },
    {
      opponent: "@mike_gamer",
      game: "Trivia Battle",
      status: "Waiting",
      timeLeft: "45m",
      avatar: "/male-gamer.png",
    },
    {
      opponent: "@alex_dev",
      game: "Memory Match",
      status: "In Progress",
      timeLeft: "Live",
      avatar: "/developer-avatar.png",
    },
  ]

  const {user, isSignedIn, isLoaded} = useUser();
  const [username, setUsername] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if(isLoaded){
      if(!isSignedIn){
        router.push('/');
      }else{
        setUsername(user.username!);
      }
    }
  }, [isLoaded]) 

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-2 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-glow">GridLock</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Settings
              </Button>
              <Button className="glow-hover bg-primary text-primary-foreground">New Challenge</Button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 glow">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <Avatar className="w-24 h-24 border-2 border-primary glow">
                  <AvatarImage src="/gamer-profile.png" />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2 text-glow">{user ? user.fullName : "XXXXX"}</h1>
                  <p className="text-xl text-primary mb-4">{username}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <Crown className="w-3 h-3 mr-1" />
                      Elite Player
                    </Badge>
                    <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                      <Zap className="w-3 h-3 mr-1" />
                      Speed Demon
                    </Badge>
                    <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                      <Trophy className="w-3 h-3 mr-1" />
                      Champion
                    </Badge>
                  </div>
                  <p className="text-muted-foreground max-w-md">
                    Competitive gamer and developer. Always up for a challenge! Specializing in speed typing and trivia
                    battles.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-glow">Gaming Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="text-center bg-gradient-to-br from-card to-card/50 border-primary/20 glow-hover">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                    >
                      <div className="text-primary">{stat.icon}</div>
                    </div>
                    <div className="text-3xl font-bold mb-2 text-glow">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.title}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Performance Overview</span>
              </CardTitle>
              <CardDescription>Your gaming performance over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Win Rate Trend</span>
                  <span className="text-primary">↗ +5% this week</span>
                </div>
                <Progress value={70} className="h-3 glow" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Speed Typing Average</span>
                  <span className="text-chart-2">85 WPM</span>
                </div>
                <Progress value={85} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Trivia Accuracy</span>
                  <span className="text-chart-3">92%</span>
                </div>
                <Progress value={92} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-glow">Ongoing Challenges</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ongoingChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.opponent}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 glow-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="border border-primary/50">
                        <AvatarImage src={challenge.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {challenge.opponent.slice(1, 3).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold">{challenge.opponent}</div>
                        <div className="text-sm text-muted-foreground">{challenge.game}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <Badge
                        className={`${
                          challenge.status === "Your Turn"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : challenge.status === "In Progress"
                              ? "bg-chart-2/10 text-chart-2 border-chart-2/20"
                              : "bg-muted/10 text-muted-foreground border-muted/20"
                        }`}
                      >
                        {challenge.status}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {challenge.timeLeft}
                      </div>
                    </div>
                    <Button
                      className="w-full glow-hover"
                      variant={challenge.status === "Your Turn" ? "default" : "outline"}
                    >
                      {challenge.status === "Your Turn" ? "Play Now" : "View Game"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
