import { AES } from "crypto-js";
import { message, role, Rooms, secretKey } from "..";
import { initializeChess } from "../chessInitialize";
import { WebSocket } from "ws";
import { logWinnerDB } from "../announceWinner";
import { announceResult } from "../contractFn";
import { isValid } from "@repo/checks";
import { JoinHandler } from "../joinHandler";
import { chessStateHandler } from "../chessJoinMsg";

export const chessHandler = async (info: message, wss: WebSocket) => {
  try {
    console.log("chess handler was called");
    const { gameId, challengeId, msg, userId } = info;
    const room = Rooms.get(challengeId);
    if (!room) {
      wss.close();
      return { success: false, status: "DNE" };
    }
    if (info.msg === "Join Room") {
      JoinHandler(challengeId, info.role, userId, wss);
      chessStateHandler(wss, userId, challengeId);
      return { success: true };
    }
    const decodedMessage = JSON.parse(msg);
    if (info.role !== role.Player || !gameId || !userId || !room) {
      console.log("unintended message by a user");
      wss.close();
      return;
    }
    let chessState = room.chessState;

    if (!chessState) {
      console.log("state initialization");
      chessState = initializeChess();
      room.chessState = chessState;
    }

    const piece = decodedMessage.piece;
    const color = piece[0];
    const initialPos: number = decodedMessage.initialPos;
    const finalPos: number = decodedMessage.finalPos;
    const currPiece: string = chessState[initialPos]!;
    const sender = userId === room.user1 ? 1 : 0;
    if (currPiece !== piece) {
      return;
    }
    const validMove = isValid(piece, initialPos!, finalPos, chessState);
    if (!validMove) {
      wss.close();
      return;
    }
    if (
      (color === "W" && userId === room.user1) ||
      (color === "B" && userId === room.user2)
    ) {
      if (chessState[finalPos] && chessState[finalPos]![1] === "K") {
        try {
          const response = await logWinnerDB(challengeId, userId);
          const annouceWinnerResponse = await announceResult(
            info.challengeId,
            sender,
          );
        } catch (e) {
          console.log(e);
        }
      }
      chessState[finalPos] = piece;
      delete chessState[initialPos];

      room.turn = color === "W" ? "B" : "W";
      const msg = {
        chessState,
        timestamp: Date.now(),
        player: userId,
        gameId,
        challengeId,
        isCompleted: chessState[finalPos]![1] === "K",
        turn: room.turn,
      };

      const encryptedMsg = AES.encrypt(
        JSON.stringify(msg),
        secretKey,
      ).toString();

      console.log("message is : ", msg);
      room?.spectators.forEach((socket: WebSocket) =>
        socket.send(encryptedMsg),
      );
      if (!room.user1_socket) console.log("user1 socket not found");
      room?.user1_socket?.send(encryptedMsg);
      if (!room.user2_socket) console.log("user2 socket not found");
      room?.user2_socket?.send(encryptedMsg);
    } else {
      wss.close();
      return;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};
