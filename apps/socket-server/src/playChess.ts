import { AES } from "crypto-js";
import { message, role, Rooms, secretKey } from ".";
import { initializeChess } from "./chessInitialize";
import { WebSocket } from "ws";
import { logWinnerDB } from "./announceWinner";
import { announceResult } from "./contractFn";
import { isValid } from "@repo/checks";

export const chessHandler = async (info: message, wss: WebSocket) => {
  console.log("invoked");
  try {
    const { gameId, challengeId, msg, userId } = info;

    // console.log(info);

    const decodedMessage = JSON.parse(msg);

    if (
      info.role !== role.Player ||
      !gameId ||
      !userId ||
      !Rooms.has(challengeId)
    ) {
      console.log("unintended message by a user");
      wss.close();
      return;
    }
    // console.log("checks done 1!");

    const room = Rooms.get(challengeId)!;
    let chessState = room?.chessState;

    if (!chessState) {
      console.log("state initialization");
      chessState = initializeChess();
      Rooms.set(challengeId, {
        ...room!,
        chessState: chessState,
      });
    }
    // console.log("checks done 2!");

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
    // console.log("valid move : ", validMove);
    if (!validMove) {
      wss.close();
      return;
    }
    if (
      (color === "W" && userId === room.user1) ||
      (color === "B" && userId === room.user2)
    ) {
      if (chessState[finalPos] && chessState[finalPos]![1] === "K") {
        const response = await logWinnerDB(challengeId, userId);
        const annouceWinnerResponse = await announceResult(
          info.challengeId,
          sender,
        );
      }
      chessState[finalPos] = piece;
      delete chessState[initialPos];

      // console.log(chessState);
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

      // console.log(room);
      room?.spectators.forEach((socket) => socket.send(encryptedMsg));
      room?.user1_socket?.send(encryptedMsg);
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
