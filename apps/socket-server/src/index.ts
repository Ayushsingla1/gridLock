import { WebSocket, WebSocketServer } from "ws";
import { room_join } from "./join_room";
import { distributionHandler } from "./playTyping";

const server = new WebSocketServer({port : 8080});

export type roomInfo = {
    user1 : string,
    user2 : string,
    spectators : Map<string,WebSocket>,
    user1_joined : boolean,
    user2_joined : boolean,
    user1_socket : WebSocket | null
    user2_socket : WebSocket | null
}

export const Rooms : Map<string,roomInfo> = new Map();

export enum role {
    Player,
    Spectator
}

export type message = {
    role : role,
    gameId : string,
    challengeId : string,
    msg : string,
    userId : string,
    password? : string
}

const PASSWORD = "HALLA@MADRID";

server.on("connection",(wss) => {
    wss.on("message",async(data) => {
        const info : message = JSON.parse(data.toString());
        console.log(info)
        if(info.msg === "Join Room"){
            await room_join(info,wss);
        }
        else{
            const parsedInfo = JSON.parse(info.toString())
            await distributionHandler(parsedInfo,wss);
        }
    })
})