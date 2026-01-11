"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Loader2, ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useAccount } from "wagmi";
import axios from "axios";
import { redeemAmount } from "../../utils/functions";

interface StakedMatch {
  matchId: string;
  userId: string;
  yesTokens: number;
  noTokens: number;
  isClaimed: boolean;
  status?: "pending" | "completed" | "cancelled";
}

const RedeemStake = () => {
  const [data, setData] = useState<StakedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const { user, isLoaded, isSignedIn } = useUser();
  const { address } = useAccount();

  const clickHandler = async (gameId: string) => {
    if (!address || !user?.username || !gameId) return;
    setClaiming(gameId);
    const result = await redeemAmount(gameId, user?.username);
    if (result.success) {
      alert("Amount withdrawn successfully");
      setData((prev) =>
        prev.map((item) =>
          item.matchId === gameId ? { ...item, isClaimed: true } : item,
        ),
      );
    } else {
      alert("Unable to withdraw amount at the moment");
    }
    setClaiming(null);
  };

  const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_SERVER;
  const ep = "/api/v1/user/stakedMatches";

  useEffect(() => {
    const getStakedMatches = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const result = await axios.get(`${HTTP_URL}${ep}`, {
          params: {
            username: user.username,
          },
        });

        if (result.data.success) {
          setData(result.data.stakedMatches);
        }
      } catch (error) {
        console.error("Error fetching staked matches:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn && user?.username) {
      getStakedMatches();
    }
  }, [isSignedIn, isLoaded, user]);

  const totalStaked = data.reduce(
    (sum, item) => sum + item.yesTokens + item.noTokens,
    0,
  );
  const claimableMatches = data.filter((item) => !item.isClaimed).length;

  const getStatusText = (item: StakedMatch) => {
    if (item.status === "pending") return "Pending Result";
    if (item.isClaimed) return "Claimed";
    return "Not Claimed";
  };

  const getStatusColor = (item: StakedMatch) => {
    if (item.status === "pending") return "text-yellow-600";
    if (item.isClaimed) return "text-green-600";
    return "text-blue-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-foreground/40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <section className="py-16 border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-light tracking-tight mb-3">
              Your Stakes
            </h1>
            <div className="flex items-baseline gap-8 text-sm text-muted-foreground">
              <span>{totalStaked.toLocaleString()} tokens staked</span>
              <span>{claimableMatches} available to claim</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clean List */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          {data.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <p>No staked matches found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.map((item, index) => (
                <motion.div
                  key={item.matchId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border border-border/50 hover:border-border transition-colors bg-card/50">
                    <CardHeader className="pb-0">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Match ID
                          </p>
                          <p className="font-mono text-sm">{item.matchId}</p>
                        </div>
                        <div
                          className={`text-xs font-medium ${getStatusColor(item)}`}
                        >
                          {getStatusText(item)}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <div className="grid grid-cols-3 gap-6 mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-foreground/60" />
                            <span className="text-xs text-muted-foreground">
                              Yes
                            </span>
                          </div>
                          <p className="text-2xl font-light">
                            {item.yesTokens}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-4 h-4 text-foreground/60" />
                            <span className="text-xs text-muted-foreground">
                              No
                            </span>
                          </div>
                          <p className="text-2xl font-light">{item.noTokens}</p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-2">
                            Total
                          </p>
                          <p className="text-2xl font-light">
                            {item.yesTokens + item.noTokens}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant={
                          item.isClaimed || item.status === "pending"
                            ? "ghost"
                            : "default"
                        }
                        size="lg"
                        className={`w-full justify-between group ${
                          item.isClaimed || item.status === "pending"
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        disabled={
                          item.isClaimed ||
                          item.status === "pending" ||
                          claiming === item.matchId
                        }
                        onClick={() => clickHandler(item.matchId)}
                      >
                        <span>
                          {claiming === item.matchId ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing
                            </span>
                          ) : item.status === "pending" ? (
                            "Match in Progress"
                          ) : item.isClaimed ? (
                            "Already Claimed"
                          ) : (
                            "Claim Reward"
                          )}
                        </span>
                        {!item.isClaimed &&
                          item.status !== "pending" &&
                          claiming !== item.matchId && (
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RedeemStake;
