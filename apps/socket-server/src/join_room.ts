import prisma from "@repo/db/dbClient";
import { message, role, Rooms } from "./index";
import WebSocket from "ws";

export const room_join = async(info : message,wss : WebSocket) => {

    if(Rooms.has(info.challengeId)){
        const roomInfo = Rooms.get(info.challengeId)!;
        if(info.role === role.Player){
            if(info.userId === roomInfo.user1){
                Rooms.set(info.challengeId,{
                    ...Rooms.get(info.challengeId)!,
                    user1_joined : true,
                    user1_socket : wss
                })
            }
            else if(info.userId === roomInfo.user2){
                Rooms.set(info.challengeId,{
                    ...Rooms.get(info.challengeId)!,
                    user2_joined : true,
                    user2_socket : wss
                }) 
            }
            else wss.close(403, "not a player");
        }
        else if(info.role === role.Spectator){
            if(info.userId === roomInfo.user1 || info.userId === roomInfo.user2){
                wss.close();
            }
            else if(roomInfo?.spectators.has(info.userId)){
                wss.close();
            }
            else{
                Rooms.set(info.challengeId,{
                    ...roomInfo,
                    spectators : roomInfo.spectators.set(info.userId,wss)
                }
                )
            }
        }
    }
    else{
        const challenge = await prisma.match.findFirst({
            where : {
                id : info.challengeId,
            }
        })
        if(challenge){
            Rooms.set(info.challengeId, {
                user1 : challenge.user1_Id,
                user2 : challenge.user2_Id,
                user1_joined : false,
                user2_joined : false,
                spectators : new Map<string,WebSocket>(),
                user1_socket : null,
                user2_socket : null
            })
    
            if(info.role === role.Player && info.userId === challenge.user1_Id){
                Rooms.set(info.challengeId,{
                    ...Rooms.get(info.challengeId)!,
                    user1 : challenge.user1_Id,
                    user1_joined : true,
                    user1_socket : wss
                })
            }
            else if(info.role === role.Player && info.userId === challenge.user2_Id){
                Rooms.set(info.challengeId,{
                    ...Rooms.get(info.challengeId)!,
                    user2 : challenge.user2_Id,
                    user2_joined : true,
                    user2_socket : wss
                }) 
            }
            else if(info.role === role.Spectator && (info.userId !== challenge.user1_Id || info.userId !== challenge.user2_Id)){
                const roomInfo = Rooms.get(info.challengeId);
                Rooms.set(info.challengeId,{
                    ...roomInfo!,
                    spectators : roomInfo?.spectators.set(info.userId,wss)!
                })
            }
        }
        else{
            wss.close(403,"No such room exists");    
        }
    }
}
