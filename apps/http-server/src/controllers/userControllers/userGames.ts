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


// export const acceptChallenge = async (req: Request, res: Response) => {
//     const {username, matchId, isAccepted}
//     try {
        
//     } catch (error) {
        
//     }
// }