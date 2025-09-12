import { Request, Response } from "express"
import prisma from "@repo/db/dbClient";
import { createGame } from "../resultAnnounce/index.js";

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

export const cancleReq = async (req: Request, res: Response) => {
    const {username, matchId} = req.body;
    try {
        const matchInfo = await prisma.match.findFirst({
            where: {
                id: matchId
            }
        })

        if(!matchInfo){
            res.status(404).json({
                success: false,
                message: "match not found!"
            })
        }


        if(matchInfo?.user1_Id != username){
            res.status(403).json({
                success: false,
                message: "unauthorized!"
            })
        }

        if(matchInfo?.status != "Pending"){
            res.status(400).json({
                success: false,
                message: "No a pending request"
            })
        }

        const delRes = await prisma.match.delete({
            where: {
                id: matchId,
                user1_Id: username
            }
        })

        if(delRes == null){
            res.status(404).json({
                success: false,
                message: "something went wrong!"
            })
        }

        res.status(200).json({
            success: true,
            message: "Req deleted successfully",
            match: delRes
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
    const {matchId, isAccepted, userId} = req.body
    try {
        const result = await prisma.$transaction(async(tx) => {
            const match = await tx.match.findFirst({
                where: {
                    id: matchId
                }
            }) 

            if(match == null){
                return {
                    status: 404,
                    success: false,
                    message: "no match found!"
                }
            }

            if(match?.user2_Id != userId){
                return {
                    status: 403,
                    success: false,
                    message: "not the correct user!"
                }
            }

            if(match?.status != "Pending"){
                return {
                    stats: 401,
                    success: false,
                    message: "status not pending"
                }
            }


            const updateMatch = await tx.match.update({
                data: {
                    //@ts-ignore
                    status: isAccepted ? "Scheduled" : "rejected"
                },
                where: {
                    id: matchId
                }
            }) 
            console.log("updated Match: ", updateMatch)

            let contractResponse: any = {};
            if(isAccepted){
                console.log(updateMatch.id);
                contractResponse = await createGame(updateMatch.id, updateMatch)
                console.log("contract Res: ", contractResponse);
            }

            if(!contractResponse.success){
                return contractResponse
            }

            if(updateMatch == null){
                return {
                    status: 404,
                    success: false,
                    message: "Something went wrong!"
                }
            }

            return {
                updateMatch,
                contractMatchId: contractResponse.id
            };
        })

        if(result.status != 200){
            res.status(parseInt(result.status) | 401).json({
                ...result
            })
        }

        res.status(200).json({
            success: true,
            message: "Match updated",
            details: result
        })

        // const match = await prisma.match.findFirst({
        //     where: {
        //         id: matchId
        //     }
        // }) 

        // if(match == null){
        //     res.status(404).json({
        //         success: false,
        //         message: "no match found!"
        //     })
        // }

        // if(match?.user2_Id != userId){
        //     res.status(401).json({
        //         success: false,
        //         message: "not the correct user!"
        //     })
        // }

        // if(match?.status != "Pending"){
        //     res.status(401).json({
        //         success: false,
        //         message: "status not pending"
        //     })
        // }

        // const updateMatch = await prisma.match.update({
        //     data: {
        //         status: isAccepted ? "Scheduled" : "rejected"
        //     },
        //     where: {
        //         id: matchId
        //     }
        // }) 

        // let contractResponse: any = {};
        // if(isAccepted){
        //     contractResponse = await createGame(updateMatch.id)
        // }
        // if(!contractResponse.success){

        // }

        // if(updateMatch == null){
        //     res.status(400).json({
        //         success: false,
        //         message: "Something went wrong!"
        //     })
        // }
} catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error
        })
    }
}