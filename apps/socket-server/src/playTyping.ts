import { WebSocket } from "ws";
import { message, role, Rooms } from "./index";
import { secretKey } from "./index";
import { AES } from "crypto-js";

export const distributionHandler = async(info : message, wss : WebSocket) => {

    const { gameId, challengeId, msg, userId } = info;

    if(info.role != role.Player || !Rooms.has(challengeId)) {
        console.log("closed in dist");
        wss.close();
        return;
    }

    const room = Rooms.get(challengeId)!;
    
    if(userId === room.user1){
        const msgToUser = {
            ...JSON.parse(msg),
            user : userId,
            gameId,
            challengeId
        }
        const sendMsg = JSON.stringify(msgToUser);
        const encryptedMsg = AES.encrypt(sendMsg, secretKey).toString();
        room.spectators.forEach((ws) => ws.send(encryptedMsg));
        console.log("sent possibly");
    }
    else if(userId === room.user2){
        const msgToUser = {
            ...JSON.parse(msg),
            user : userId,
            gameId,
            challengeId
        }
        const sendMsg = JSON.stringify(msgToUser);
        const encryptedMsg = AES.encrypt(sendMsg, secretKey).toString();
        room.spectators.forEach((ws) => ws.send(encryptedMsg));
        console.log("sent possibly");
    }
    else{
        wss.close();
        return;
    }
}