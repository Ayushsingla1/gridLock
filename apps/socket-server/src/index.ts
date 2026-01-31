import { WebSocket, WebSocketServer } from "ws";
import "dotenv/config";
import CryptoJS from "crypto-js";
import { AES } from "crypto-js";
import { configDotenv } from "dotenv";
import { ethers } from "ethers";
import { abi, contractAddress } from "./utils/contractInfo";
import { mainHandler } from "./joinHandler";

configDotenv();
const server = new WebSocketServer({ port: 8080 });
export const secretKey = process.env.ECRYPTION_SECRET!;
const privateKey = process.env.PRIVATE_KEY!;
const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");
const wallet = new ethers.Wallet(privateKey, provider);
export const contract = new ethers.Contract(contractAddress, abi, wallet);

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
  isCompleted?: boolean;
};

export const Rooms: Map<string, roomInfo> = new Map();

export enum role {
  Player,
  Spectator,
}

export type message = {
  role: role;
  gameId: number;
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
    await mainHandler(info, wss);
  });
});
