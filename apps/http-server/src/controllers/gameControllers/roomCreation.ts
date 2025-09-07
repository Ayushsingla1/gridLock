import prisma from '@repo/db/dbClient'
import { Request, Response } from 'express'
import { postTweet } from '../twitterControllers/post.controllers'
import { success } from 'zod'

interface createRoomProps {
    gameId: string,
    userId_1: string,
    userId_2: string,
    startTime: Date
}

export const createRoom = async ({gameId, userId_1, userId_2, startTime} : createRoomProps) => {

    try {
        const createdMatch = await prisma.match.create({
            data: {
                gameId,
                user1_Id: userId_1,
                user2_Id: userId_2,
                ExpiresAt: startTime
            } 
        })   

        if(createdMatch == null){
            return {
                status: 400,
                success: false,
                message: 'Error while creating a Match'
            } 
        }

        return {
            status: 200,
            success: true,
            message: "Room Created!",
            data: {
                matchId: createdMatch.id,
                scheduledTime: createdMatch.ExpiresAt,
                gameId: createdMatch.gameId,
                challenger: createdMatch.user1_Id,
                challenged: createdMatch.user2_Id,
            }
        }
    } catch (error) {
        return {
            status: 500,
            success: false,
            error: error,
            message: "server error"
        }       
    }
     
}

export const fetchUser = async (user1: string, user2: string) => {
    console.log("user1: ", user1, " user2: ", user2)
    try {
        const challengerId = await prisma.user.findFirst({
            where: {
                username: user1    
            },
            select: {
                username: true
            }
        })

        console.log("challnger: ", challengerId)

        if(challengerId == null){
            return {
                status: 403,
                success: false,
                message: 'Challenger not found!'
            }
        }

        const challengedId = await prisma.user.findFirst({
            where: {
                username: user2
            },
            select: {
                username: true
            }
        })

        console.log("challenged: ", challengedId)

        if(challengedId == null){
            return {
                status: 403,
                success: false,
                message: 'Challenged user not found!'
            }
        }

        return {
            status: 200,
            success: true,
            data: {
                challengedId : challengedId.username,
                challengerId : challengerId.username
            },
            message: "userIDs found!"
        }
        
    } catch (error) {
        console.log('server in fetch user error!')
        return {
            status: 500,
            success: false,
            error: error,
            message: "server error"
        } 
    }
}

export const createMatch = async (req: Request, res: Response) => {
    const { challenger, challenged, game, gameId, startTime } = req.body;
    try {

        // post created (commented for now but working fine)
        const postResponse = await postTweet({challenger, challenged, game});
        if(postResponse.status == 403){
            res.status(postResponse.status).json(postResponse)
            return;
        }else if(postResponse.status == 500){
            res.status(postResponse.status).json(postResponse)
            return;
        }

        //fetch users
        const usersResponse = await fetchUser(challenger, challenged); 
        if(usersResponse.status == 403){
            res.status(403).json(usersResponse)
        }else if(usersResponse.status == 500){
            res.status(500).json(usersResponse);
        }

        const userId_1 = usersResponse.data?.challengerId!;
        const userId_2 = usersResponse.data?.challengedId!;
        console.log(userId_1, userId_2);

        //room creation
        const roomResponse = await createRoom({gameId, startTime, userId_1, userId_2});

        if(roomResponse.status == 400){
            res.status(400).json(roomResponse);
        }else if(roomResponse.status == 500) {
            res.status(500).json(roomResponse);
        }
        
        res.status(200).json(roomResponse);

    } catch (error) {
       res.status(500).json({
        success: false,
        message: "Server Error"
       }) 
    }
}


  