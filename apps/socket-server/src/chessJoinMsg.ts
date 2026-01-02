import { WebSocket } from "ws";
import { Rooms } from ".";
import { initializeChess } from "./chessInitialize";
import { AES } from "crypto-js";

export const JoinMsgHandler = (
  socket: WebSocket,
  userId: string,
  challengeId: string,
) => {
  const room = Rooms.get(challengeId)!;
  let color: string;
  let chessState: Record<number, string>;

  if (userId === room.user1) color = "W";
  else color = "B";

  if (!room.chessState) {
    room.chessState = initializeChess();
  }
  chessState = room.chessState;
  if (!room.turn) room.turn = "W";

  const msg = {
    status: "Joined",
    color,
    chessState,
    turn: room.turn,
  };

  const encryptedMsg = AES.encrypt(JSON.stringify(msg), "SECRET").toString();
  socket.send(encryptedMsg);
};
