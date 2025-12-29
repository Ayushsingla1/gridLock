import prisma from "@repo/db/dbClient";
import { Request, Response } from "express";

export const getUserProfile = async (req: Request, res: Response) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).json({
      success: false,
      msg: "Username not found",
    });
  }

  const result = await prisma.user.findFirst({
    where: {
      username: username as string,
    },
    include: {
      matchesAsUser1: true,
      matchesAsUser2: true,
    },
  });

  if (!result) {
    res.status(404).json({
      success: false,
      msg: "User not found",
    });
  }

  let matchPlayed: number = 0;
  let matchWon: number = 0;

  const matchesInfo = result?.matchesAsUser1.filter(
    (data) => data.status == "Completed",
  );
  matchPlayed = matchesInfo?.length || 0;
  matchWon =
    matchesInfo?.filter((data) => data.winnerId === username).length || 0;

  const matchLost = matchPlayed - matchWon;
  const winPercentage = (matchWon / matchPlayed) * 100;

  res.status(200).json({
    success: true,
    matchPlayed,
    matchWon,
    matchLost: matchLost,
    winPercentage: winPercentage,
  });
};
