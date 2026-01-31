"use client";
import Nav from "@/components/ui/nav";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import RegisteredGames from "@/components/ui/RegisteredGames";
import { Match } from "@/types/gameTypes";

export default function MyGames() {
  const ep = "/api/v1/user/getMatches";
  const { user } = useUser();
  // const username = process.env.NEXT_PUBLIC_USERNAME
  const [challengesSent, setChallengesSent] = useState<Match[] | []>([]);
  const [challengesRec, setChallengesRec] = useState<Match[] | []>([]);
  const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_SERVER;
  useEffect(() => {
    if (user) {
      axios
        .get(`${HTTP_URL}${ep}`, {
          params: {
            username: user?.username,
            // username: username
          },
        })
        .then((res) => {
          setChallengesSent(res.data.data.challengesSent);
          setChallengesRec(res.data.data.challengesRecieved);
          console.log(res.data);
        });
    } else {
      console.log("user not loaded");
      return;
    }
  }, [user]);

  return (
    <div className="min-h-screen">
      <Nav />
      <RegisteredGames
        username={user?.username}
        sentMatches={challengesSent}
        recMatches={challengesRec}
      />
    </div>
  );
}
