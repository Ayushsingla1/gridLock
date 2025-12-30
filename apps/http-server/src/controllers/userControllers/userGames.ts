import { Request, Response } from "express";
import prisma from "@repo/db/dbClient";
import { createGame } from "../resultAnnounce/index.js";

export const getChallengedMatches = async (req: Request, res: Response) => {
  console.log(req.query);
  const { username } = req.query;
  console.log(username);

  try {
    const allMatches = await prisma.user.findFirst({
      where: {
        username: username as string,
      },
      select: {
        username: true,
        matchesAsUser1: true,
        matchesAsUser2: true,
      },
    });

    if (allMatches == null) {
      res.status(404).json({
        success: false,
        message: "user not found!",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "user found",
      data: {
        username: allMatches.username,
        challengesSent: allMatches.matchesAsUser1,
        challengesRecieved: allMatches.matchesAsUser2,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const cancleReq = async (req: Request, res: Response) => {
  console.log("hi there");
  const { username, matchId } = req.body;
  console.log(req.body);
  try {
    const matchInfo = await prisma.match.findFirst({
      where: {
        id: matchId,
      },
    });

    if (!matchInfo) {
      return res.status(404).json({
        success: false,
        message: "match not found!",
      });
    }

    if (matchInfo?.user1_Id != username) {
      return res.status(403).json({
        success: false,
        message: "unauthorized!",
      });
    }

    if (matchInfo?.status != "Pending") {
      return res.status(400).json({
        success: false,
        message: "No a pending request",
      });
    }

    const delRes = await prisma.match.delete({
      where: {
        id: matchId,
        user1_Id: username,
      },
    });

    if (delRes == null) {
      return res.status(404).json({
        success: false,
        message: "something went wrong!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Req deleted successfully",
      match: delRes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// export interface MatchSchema {
//     status: "Pending" | "Completed" | "Scheduled" | "rejected";
//     id: string;
//     createdAt: Date;
//     ExpiresAt: Date;
//     user1_Id: string;
//     user2_Id: string;
//     gameId: string;
// }

export const acceptChallenge = async (req: Request, res: Response) => {
  const { matchId, isAccepted, userId } = req.body;
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const match = await tx.match.findFirst({
          where: {
            id: matchId,
          },
        });

        if (match == null) {
          return {
            status: 404,
            success: false,
            message: "no match found!",
          };
        }

        if (match?.user2_Id != userId) {
          return {
            status: 403,
            success: false,
            message: "not the correct user!",
          };
        }

        if (match?.status != "Pending") {
          return {
            status: 401,
            success: false,
            message: "status not pending",
          };
        }

        const updateMatch = await tx.match.update({
          data: {
            //@ts-ignore
            status: isAccepted ? "Scheduled" : "rejected",
          },
          where: {
            id: matchId,
          },
        });
        console.log("updated Match: ", updateMatch);

        let contractResponse: any = {};
        if (isAccepted) {
          console.log(updateMatch.id);
          contractResponse = await createGame(updateMatch.id, updateMatch);
          console.log("contract Res: ", contractResponse);
        } else {
          return res.status(200).json({
            success: true,
            msg: "match rejected",
          });
        }

        if (!contractResponse.success) {
          return contractResponse;
        }

        if (updateMatch == null) {
          return {
            status: 404,
            success: false,
            message: "Something went wrong!",
          };
        }

        return {
          status: 200,
          updateMatch,
          contractMatchId: contractResponse.id,
        };
      },
      { maxWait: 15000, timeout: 15000 },
    );

    if (result.status != 200) {
      console.log(result);
      return res.status(parseInt(result.status) | 401).json({
        ...result,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Match updated",
      details: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getAllScheduledMatches = async (req: Request, res: Response) => {
  try {
    const result = await prisma.match.findMany({
      where: {
        status: "Scheduled",
      },
      include: {
        user1: {
          select: {
            username: true,
            name: true,
          },
        },
        user2: {
          select: {
            username: true,
            name: true,
          },
        },
        game: {
          select: {
            GameName: true,
            GameType: true,
            GameDescription: true,
          },
        },
      },
    });

    if (result == null) {
      console.log("empty matches table");
      return res.status(200).json({
        success: true,
        message: "no entries in the table",
      });
    }

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const stakeAmount = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { matchId, userId, amountTokens, bet } = req.body;
    if (
      !matchId ||
      !userId ||
      !amountTokens ||
      amountTokens === 0 ||
      typeof bet !== "boolean"
    ) {
      console.log("data missing");
      return res.status(400).json({
        success: false,
        msg: "incomplete data",
      });
    }

    let yesTokens = 0;
    let noTokens = 0;

    if (bet) {
      yesTokens += amountTokens;
    } else noTokens += amountTokens;
    const _createOrUpdateStake = await prisma.stake.upsert({
      create: {
        matchId: matchId,
        userId: userId,
        yesTokens: yesTokens,
        noTokens: noTokens,
      },
      where: {
        matchId_userId: {
          matchId: matchId,
          userId: userId,
        },
      },
      update: {
        yesTokens: { increment: yesTokens },
        noTokens: { increment: noTokens },
      },
    });

    if (_createOrUpdateStake) {
      return res.status(200).json({
        success: true,
        msg: "successfully done!",
      });
    } else {
      return res.status(500).json({
        success: false,
        msg: "something went wrong",
      });
    }
  } catch (error) {
    console.log("error while writing to db.");
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
    });
  }
};

export const redeemAmount = async (req: Request, res: Response) => {
  try {
    const { userId, matchId } = req.body;

    if (!userId || !matchId) {
      return res.status(400).json({
        success: false,
        msg: "missing userId or matchId.",
      });
    }
    const _claimed = await prisma.stake.update({
      data: {
        isClaimed: true,
      },
      where: {
        matchId_userId: {
          matchId: matchId,
          userId: userId,
        },
      },
    });

    if (_claimed) {
      return res.status(200).json({
        success: true,
      });
    }
    return res.status(500).json({
      success: false,
      msg: "Internal server error.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error.",
    });
  }
};
