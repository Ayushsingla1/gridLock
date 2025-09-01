"use client"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Gamepad2,
  Users,
  Eye,
  Trophy,
  Zap,
  Target,
  Crown,
  Star,
  TrendingUp,
  Clock,
  Shield,
  Sparkles,
  Play,
  ArrowRight,
} from "lucide-react"
import { useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Nav from "@/components/ui/nav"

export default function HomePage() {
  const [hoveredGame, setHoveredGame] = useState<number | null>(null)
  const [activeFeature, setActiveFeature] = useState(0)

  const gameCards = [
    {
      title: "Speed Typing",
      description: "Race against your followers in lightning-fast typing challenges",
      icon: <Zap className="w-6 h-6" />,
      color: "from-primary/20 to-primary/5",
      stats: { avgTime: "45s", players: "2.3K", difficulty: "Medium" },
      preview: "Type faster than your opponent to claim victory. Real-time WPM tracking with live leaderboards.",
    },
    {
      title: "Trivia Battle",
      description: "Test your knowledge in head-to-head trivia competitions",
      icon: <Target className="w-6 h-6" />,
      color: "from-chart-2/20 to-chart-2/5",
      stats: { avgTime: "2m", players: "4.1K", difficulty: "Hard" },
      preview:
        "Answer questions faster and more accurately than your rival. Categories include tech, sports, and pop culture.",
    },
    {
      title: "Memory Match",
      description: "Challenge your memory skills in fast-paced pattern games",
      icon: <Crown className="w-6 h-6" />,
      color: "from-chart-3/20 to-chart-3/5",
      stats: { avgTime: "90s", players: "1.8K", difficulty: "Easy" },
      preview: "Remember and repeat increasingly complex patterns. Perfect for quick mental workouts with friends.",
    },
  ]

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Challenge",
      description: "Connect your X account and challenge any of your followers to competitive mini-games",
      details:
        "Browse your followers, send game invites, and create custom tournaments. Set stakes, choose games, and watch the competition unfold.",
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "Play",
      description: "Compete in real-time games designed for quick, intense matches that test your skills",
      details:
        "Lightning-fast matchmaking, real-time gameplay, and instant results. Every game is optimized for mobile and desktop play.",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Spectate",
      description: "Watch live matches between friends and see who comes out on top in the arena",
      details:
        "Live streaming of matches, real-time chat, and betting on outcomes. Turn every game into a community event.",
    },
  ]

  const liveStats = [
    { label: "Active Players", value: "12.4K", icon: <Users className="w-5 h-5" /> },
    { label: "Games Played Today", value: "89.2K", icon: <Play className="w-5 h-5" /> },
    { label: "Live Spectators", value: "3.7K", icon: <Eye className="w-5 h-5" /> },
    { label: "Avg Match Time", value: "2m 15s", icon: <Clock className="w-5 h-5" /> },
  ]

  const testimonials = [
    {
      name: "@techinfluencer",
      text: "GridLock turned my boring Tuesday into an epic gaming session with my followers. This is the future!",
      followers: "45K followers",
    },
    {
      name: "@gamingqueen",
      text: "Finally, a way to actually compete with my audience instead of just talking to them. Game changer!",
      followers: "128K followers",
    },
    {
      name: "@startupfounder",
      text: "My team uses GridLock for team building. Nothing beats beating your CEO in Speed Typing 😂",
      followers: "23K followers",
    },
  ]

  console.log(process.env.NEXT_PUBLIC_ENCRYPTION_SECRET);
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Nav/>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-chart-2/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 glow">
                <TrendingUp className="w-4 h-4 mr-2" />🚀 First-Mover Advantage
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-glow">
                Turn Followers into{" "}
                <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">Rivals</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Connect your X account, challenge your followers in fun games, and let the world watch. Nothing like
                this exists — until now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <ConnectButton/>
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
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              >
                {liveStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 text-center glow-hover"
                  >
                    <div className="flex items-center justify-center mb-2 text-primary">{stat.icon}</div>
                    <div className="text-2xl font-bold text-glow">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Game Previews */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-glow">Competitive Mini-Games</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quick, intense challenges designed to bring out your competitive spirit
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {gameCards.map((game, index) => (
              <motion.div
                key={game.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
                onMouseEnter={() => setHoveredGame(index)}
                onMouseLeave={() => setHoveredGame(null)}
              >
                <Card className="h-full bg-gradient-to-br from-card to-card/50 border-primary/20 glow-hover transition-all duration-300 overflow-hidden">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      {game.icon}
                    </div>
                    <CardTitle className="text-xl">{game.title}</CardTitle>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="secondary">{game.stats.avgTime}</Badge>
                      <Badge variant="secondary">{game.stats.players} players</Badge>
                      <Badge variant="outline">{game.stats.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground mb-4">{game.description}</CardDescription>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: hoveredGame === index ? "auto" : 0,
                        opacity: hoveredGame === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-border/50">
                        <p className="text-sm text-muted-foreground">{game.preview}</p>
                        <Button size="sm" className="mt-3 w-full bg-transparent" variant="outline">
                          <Play className="w-4 h-4 mr-2" />
                          Try Demo
                        </Button>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-glow">Challenge. Play. Spectate.</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The complete social gaming experience that turns your social network into an arena
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center group cursor-pointer"
                onClick={() => setActiveFeature(index)}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all glow-hover ${activeFeature === index ? "scale-110 glow" : ""}`}
                >
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{feature.description}</p>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: activeFeature === index ? "auto" : 0,
                    opacity: activeFeature === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">{feature.details}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-glow">What Creators Are Saying</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of creators already building their gaming communities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full bg-gradient-to-br from-card to-card/50 border-primary/20 glow-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">{testimonial.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {testimonial.followers}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* First Mover Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-chart-2/5 to-primary/10 relative overflow-hidden">
        <motion.div
          animate={{ x: [-100, 100, -100] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ x: [100, -100, 100] }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute bottom-10 right-10 w-32 h-32 bg-chart-2/20 rounded-full blur-xl"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Trophy className="w-16 h-16 mx-auto mb-6 text-primary" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-glow">We're the First in This Space</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              GridLock is pioneering a completely new category of social gaming. No one has ever connected social media
              followers with competitive gaming and live spectating. You're witnessing the birth of social esports.
            </p>
            <div className="flex items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure X Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>5-Star Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>12K+ Active Users</span>
              </div>
            </div>
            <Button size="lg" className="glow-hover bg-primary text-primary-foreground text-lg px-8 py-6 group">
              <Crown className="w-5 h-5 mr-2" />
              Be a Pioneer
              <Sparkles className="w-4 h-4 ml-2 group-hover:animate-pulse" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-2 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-glow">GridLock</span>
            </div>
            <p className="text-muted-foreground">© 2024 GridLock. The future of social gaming.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


