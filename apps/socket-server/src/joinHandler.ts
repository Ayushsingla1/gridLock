import { WebSocket } from "ws";
import { message, role, Rooms, secretKey } from ".";
import prisma from "@repo/db/dbClient";
import { initializeChess } from "./chessInitialize";
import { chessHandler } from "./chess/playChess";
import { typingHandler } from "./typing/playTyping";
import { AES } from "crypto-js";

export const roomExists = (challengeId: string) => {
  return Rooms.has(challengeId);
};

export const createRoom = async (challengeId: string, gameId: number) => {
  try {
    const challenge = await prisma.match.findFirst({
      where: {
        id: challengeId,
      },
    });

    console.log(challenge);

    if (!challenge) return { success: false, status: "DNE" };
    if (challenge.status === "Completed")
      return { success: false, status: "Completed" };

    console.log("challenge found : ", challengeId);
    if (!Rooms.has(challengeId)) {
      // helpful ig when multiple user joins at the same time might have been overwritten else
      Rooms.set(challengeId, {
        user1_joined: false,
        user1_socket: null,
        user2_joined: false,
        user2_socket: null,
        user1: challenge.user1_Id,
        user2: challenge.user2_Id,
        spectators: new Map<string, WebSocket>(),
        chessState: gameId == 2 ? initializeChess() : undefined,
      });
    }
    return { success: true, status: "Created" };
  } catch (e) {
    console.log(e);
    return { success: false, status: "Internal Error" };
  }
};

export const mainHandler = async (info: message, wss: WebSocket) => {
  const { msg, challengeId, gameId } = info;
  if (roomExists(challengeId)) {
    console.log("challengeId exists");
    if (gameId == 1) typingHandler(info, wss);
    else if (gameId == 2) chessHandler(info, wss);
  } else {
    console.log("challengeId exists not");
    const roomCreation = await createRoom(challengeId, gameId);
    if (roomCreation.success) {
      console.log("success creation");
      if (msg != "Join Room") {
        wss.send(
          AES.encrypt(
            JSON.stringify({
              status: "join the room first",
            }),
            secretKey,
          ).toString(),
        );
        return wss.close();
      } else if (gameId == 1) typingHandler(info, wss);
      else if (gameId == 2) chessHandler(info, wss);
    } else {
      wss.send(
        AES.encrypt(
          JSON.stringify({
            status: roomCreation.status,
          }),
          secretKey,
        ).toString(),
      );
      wss.close();
    }
  }
};

export const JoinHandler = (
  challengeId: string,
  r: role,
  userId: string,
  wss: WebSocket,
) => {
  const room = Rooms.get(challengeId);
  if (!room) return { success: false, status: "DNE" };

  if (r === role.Spectator) {
    if (room.spectators.has(userId)) room.spectators.get(userId)?.close();
    room.spectators.set(userId, wss);
    console.log("done!");
  } else if (r === role.Player) {
    if (userId == room.user1) {
      console.log("Player 1 joining");
      if (room.user1_joined && room.user1_socket) {
        room.user1_socket.close();
      }
      room.user1_socket = wss;
    } else if (userId == room.user2) {
      console.log("Player 2 joining");
      if (room.user2_joined && room.user2_socket) {
        room.user2_socket.close();
      }
      room.user2_socket = wss;
    }
  } else wss.close();
};
