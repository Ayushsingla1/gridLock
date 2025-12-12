import { WebSocket } from "ws";
import { message, role, Rooms } from "./index";
import { secretKey } from "./index";
import { AES } from "crypto-js";
import prisma from "@repo/db/dbClient";
import { announceResult } from "./contractFn";

// announce winner for the match
const logWinnerDB = async (matchId: String, userId: String) => {
    try {
        const result = await prisma.match.update({
            data: {
                winnerId: userId as string,
                status: "Completed",
            },
            where: {
                id: matchId as string
            }
        })

        if(result == null){
            return {
                success: false,
                message: "no match found!"
            }
        }

        return {
            success: true,
            ...result
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "error while updating the db"
        }
    }
}

// send message to everyone
export const distributionHandler = async(info : message, wss : WebSocket) => {

    const { gameId, challengeId, msg, userId } = info;

    if(info.role != role.Player || !Rooms.has(challengeId)) {
        console.log("closed in dist");
        wss.close();
        return;
    }

    const room = Rooms.get(challengeId)!;
    const parsedMsg = JSON.parse(msg);
    
    if(userId === room.user1){
        const msgToUser = {
            ...parsedMsg,
            user : userId,
            gameId,
            challengeId
        }
        const sendMsg = JSON.stringify(msgToUser);
        const encryptedMsg = AES.encrypt(sendMsg, secretKey).toString();
        if(parsedMsg.isComplete){
            const response = await logWinnerDB(challengeId, userId);
            const annouceWinnerResponse = await announceResult(info.challengeId, 1);
        }
        room.spectators.forEach((ws) => ws.send(encryptedMsg));
        if(parsedMsg.isComplete){
            room.user2_socket?.send(encryptedMsg);
            room.user1_socket?.send(encryptedMsg);
        }

        
        console.log("sent possibly");
    }
    else if(userId === room.user2){
        const msgToUser = {
            ...parsedMsg,
            user : userId,
            gameId,
            challengeId
        }
        const sendMsg = JSON.stringify(msgToUser);
        const encryptedMsg = AES.encrypt(sendMsg, secretKey).toString();
        if(parsedMsg.isComplete){
            const response = await logWinnerDB(challengeId, userId);
            const annouceWinnerResponse = await announceResult(info.challengeId, 0);
        }
        room.spectators.forEach((ws) => ws.send(encryptedMsg));

        if(parsedMsg.isComplete){
            room.user1_socket?.send(encryptedMsg);
            room.user2_socket?.send(encryptedMsg);
        }


        console.log("sent possibly");
    }
    else{
        wss.close();
        return;
    }
}