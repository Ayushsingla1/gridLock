import { WebSocket, WebSocketServer } from "ws";
import { room_join } from "./join_room";
import { distributionHandler } from "./playTyping";
import 'dotenv/config'
import CryptoJS from "crypto-js";
import { AES } from "crypto-js";
import { configDotenv } from "dotenv";

configDotenv();

const privateKey = process.env.PRIVATE_KEY!;
const server = new WebSocketServer({port : 8080});
// export const secretKey = process.env.ECRYPTION_SECRET || "SECRET";
export const secretKey = "SECRET";
console.log(privateKey);

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
        const decrtyptedMsgBytes = AES.decrypt(data.toString(), secretKey);
        const decrtyptedMsg = decrtyptedMsgBytes.toString(CryptoJS.enc.Utf8);
        const info : message = JSON.parse(decrtyptedMsg as string);
        if(info.msg === "Join Room"){
            await room_join(info,wss);
        }
        else{
            await distributionHandler(info,wss);
        }
    })
})