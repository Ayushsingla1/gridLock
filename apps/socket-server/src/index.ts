import { WebSocket, WebSocketServer } from "ws";
import { room_join } from "./join_room";
import { distributionHandler } from "./playTyping";
import "dotenv/config";
import CryptoJS from "crypto-js";
import { AES } from "crypto-js";
import { configDotenv } from "dotenv";
import { chessHandler } from "./playChess";

configDotenv();

const privateKey = process.env.PRIVATE_KEY!;
const server = new WebSocketServer({ port: 8080 });
export const secretKey = process.env.ECRYPTION_SECRET!;

export type roomInfo = {
  user1: string;
  user2: string;
  spectators: Map<string, WebSocket>;
  user1_joined: boolean;
  user2_joined: boolean;
  user1_socket: WebSocket | null;
  user2_socket: WebSocket | null;
  chessState?: Record<number, string>;
  turn?: string;
};

export const Rooms: Map<string, roomInfo> = new Map();

export enum role {
  Player,
  Spectator,
}

export type message = {
  role: role;
  gameId: string;
  challengeId: string;
  msg: string;
  userId: string;
  password?: string;
};

server.on("connection", (wss) => {
  wss.on("message", async (data) => {
    console.log("message received");
    const decrtyptedMsgBytes = AES.decrypt(data.toString(), secretKey);
    const decrtyptedMsg = decrtyptedMsgBytes.toString(CryptoJS.enc.Utf8);
    const info: message = JSON.parse(decrtyptedMsg as string);
    console.log(info);
    if (info.msg === "Join Room") {
      await room_join(info, wss);
    } else {
      if (info.gameId === "chess") {
        // console.log("hi tehre");
        await chessHandler(info, wss);
      } else if (info.gameId === "typing") {
        console.log("hi there");
        await distributionHandler(info, wss);
      }
    }
  });
});
