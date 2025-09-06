import { Request, Response } from "express"
import prisma from "@repo/db/dbClient";

export const getChallengedMatches = async (req: Request, res: Response) => {
    console.log(req.query);
    const {username} = req.query;
    console.log(username);

    try {
        const allMatches = await prisma.user.findFirst({
            where: {
                username: username as string 
            },
            select: {
                username: true,
                matchesAsUser1: true,
                matchesAsUser2: true,
            }
        })      

        if(allMatches == null){
            res.status(404).json({
                success: false,
                message: "user not found!"
            })
            return;
        }

        res.status(200).json({
            success: true,
            message: 'user found',
            data: {
                username: allMatches.username,
                challengesSent: allMatches.matchesAsUser1,
                challengesRecieved: allMatches.matchesAsUser2
            }
        })
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}


export const acceptChallenge = async (req: Request, res: Response) => {
    const {matchId, isAccepted, userId} = req.body
    try {
        const match = await prisma.match.findFirst({
            where: {
                id: matchId
            }
        }) 

        if(match == null){
            res.status(404).json({
                success: false,
                message: "no match found!"
            })
        }

        if(match?.user2_Id != userId){
            res.status(401).json({
                success: false,
                message: "not the correct user!"
            })
        }

        if(match?.status != "Pending"){
            res.status(401).json({
                success: false,
                message: "status not pending"
            })
        }

        const updateMatch = await prisma.match.update({
            data: {
                status: isAccepted ? "Scheduled" : "rejected"
            },
            where: {
                id: matchId
            }
        }) 

        if(updateMatch == null){
            res.status(400).json({
                success: false,
                message: "Something went wrong!"
            })
        }

        res.status(200).json({
            success: true,
            message: "Match updated",
            details: updateMatch
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error
        })
    }
}