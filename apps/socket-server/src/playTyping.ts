import { WebSocket } from "ws";
import { message, role, Rooms } from "./index";
import { secretKey } from "./index";
import { AES } from "crypto-js";
import prisma from "@repo/db/dbClient";
import { announceResult } from "./contractFn";
import { logWinnerDB } from "./announceWinner";
// send message to everyone
export const distributionHandler = async (info: message, wss: WebSocket) => {
  const { gameId, challengeId, msg, userId } = info;

  if (info.role != role.Player || !Rooms.has(challengeId)) {
    console.log("closed in dist");
    wss.close();
    return;
  }

  const room = Rooms.get(challengeId)!;
  const parsedMsg = JSON.parse(msg);

  const sender = userId === room.user1 ? 1 : 0;

  if (userId === room.user1 || userId == room.user2) {
    const msgToUser = {
      ...parsedMsg,
      user: userId,
      gameId,
      challengeId,
    };
    const sendMsg = JSON.stringify(msgToUser);
    const encryptedMsg = AES.encrypt(sendMsg, secretKey).toString();
    if (parsedMsg.isComplete) {
      console.log("hi there");
      const response = await logWinnerDB(challengeId, userId);
      const annouceWinnerResponse = await announceResult(
        info.challengeId,
        sender,
      );
    }
    room.spectators.forEach((ws) => ws.send(encryptedMsg));
    if (parsedMsg.isComplete) {
      room.user2_socket?.send(encryptedMsg);
      room.user1_socket?.send(encryptedMsg);
    }
    console.log("sent possibly");
  } else {
    wss.close();
    return;
  }
};
