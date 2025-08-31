import { WebSocket } from "ws";
import { message, role, Rooms } from "./index";

export const distributionHandler = async(info : message, wss : WebSocket) => {

    const { gameId, challengeId, msg, userId } = info;

    if(info.role != role.Player || !Rooms.has(challengeId)) {
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
        room.spectators.forEach((ws) => ws.send(JSON.stringify(msgToUser)));
        console.log("sent possibly");
    }
    else if(userId === room.user2){
        const msgToUser = {
            ...JSON.parse(msg),
            user : userId,
            gameId,
            challengeId
        }
        room.spectators.forEach((ws) => ws.send(JSON.stringify(msgToUser)));
        console.log("sent possibly");
    }
    else{
        wss.close();
        return;
    }
}