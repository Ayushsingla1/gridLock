import { AES } from "crypto-js";
import { message, role, Rooms, secretKey } from ".";
import { initializeChess } from "./chessInitialize";
import { WebSocket } from "ws";
import { logWinnerDB } from "./announceWinner";
import { announceResult } from "./contractFn";

export const chessHandler = async (info: message, wss: WebSocket) => {
  try {
    const { gameId, challengeId, msg, userId } = info;

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

    const room = Rooms.get(challengeId)!;
    let chessState = room?.chessState;

    if (!chessState) {
      chessState = initializeChess();
      Rooms.set(challengeId, {
        ...room!,
        chessState: chessState,
      });
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
      (color === "W" && userId === "user1") ||
      (color === "B" && userId === "user2")
    ) {
      if (chessState[finalPos]![1] === "K") {
        const response = await logWinnerDB(challengeId, userId);
        const annouceWinnerResponse = await announceResult(
          info.challengeId,
          sender,
        );
      }
      chessState[finalPos] = piece;
      delete chessState[initialPos];

      const msg = {
        chessState,
        timestamp: Date.now(),
        player: userId,
        gameId,
        challengeId,
        isCompleted: chessState[finalPos]![1] === "K",
      };
      const encryptedMsg = AES.encrypt(
        JSON.stringify(msg),
        secretKey,
      ).toString();
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

const isValid = (
  piece: string,
  initialPos: number,
  finalPos: number,
  chessState: Record<number, string>,
): boolean => {
  const initialRow = initialPos / 10;
  const initialCol = initialPos % 10;
  const finalRow = finalPos / 10;
  const finalCol = finalPos % 10;
  const color = piece[0]!;
  const chessPiece = piece[1];

  if (chessPiece === "K") {
    // single move but inital can be double
    return kingMovement(
      color,
      initialRow,
      initialCol,
      finalRow,
      finalCol,
      chessState,
    );
  } else if (chessPiece === "Q") {
    // all move possible
    return queenMovement(
      color,
      initialRow,
      initialCol,
      finalRow,
      finalCol,
      chessState,
    );
  } else if (chessPiece === "R") {
    // horizontal and vertical moves only
    return rookMovement(
      color,
      initialRow,
      initialCol,
      finalRow,
      finalCol,
      chessState,
    );
  } else if (chessPiece === "H") {
    // 2.5 steps can jump over others
    return knightMovement(
      color,
      initialRow,
      initialCol,
      finalRow,
      finalPos,
      chessState,
    );
  } else if (chessPiece === "B") {
    // can move diagonally
    return bishopMovement(
      color,
      initialRow,
      initialCol,
      finalRow,
      finalCol,
      chessState,
    );
  } else if (chessPiece === "P") {
    // can move initally 2 step and only 1 step afterward can't move backwards
    return pawnMovement(
      color,
      initialRow,
      initialCol,
      finalRow,
      finalCol,
      chessState,
    );
  }
  return false;
};

const pawnMovement = (
  color: string,
  initialRow: number,
  initialCol: number,
  finalRow: number,
  finalCol: number,
  chessState: Record<number, string>,
) => {
  if (Math.abs(finalRow - initialRow) === 2) {
    if (finalCol !== initialCol) return false;
    if (
      color === "B" &&
      initialRow === 7 &&
      !chessState[(initialRow - 1) * 10 + initialCol] &&
      !chessState[(initialRow - 2) * 10 + initialCol]
    )
      return true;
    if (
      color === "W" &&
      initialRow === 2 &&
      !chessState[(initialRow + 1) * 10 + initialCol] &&
      !chessState[(initialRow + 2) * 10 + initialCol]
    )
      return true;
    return false;
  } else if (color === "B") {
    if (
      finalCol === initialCol &&
      finalRow === initialRow - 1 &&
      !chessState[finalRow * 10 + finalCol]
    )
      return true;
    if (
      (finalCol === initialCol - 1 || finalCol === initialCol + 1) &&
      finalRow === initialRow - 1 &&
      chessState[finalRow * 10 + finalCol]![1] === "W"
    )
      return true;
    return false;
  } else if (color === "W") {
    if (
      finalCol === initialCol &&
      finalRow === initialRow + 1 &&
      !chessState[finalRow * 10 + finalCol]
    )
      return true;
    if (
      (finalCol === initialCol - 1 || finalCol === initialCol + 1) &&
      finalRow === initialRow + 1 &&
      chessState[finalRow * 10 + finalCol]![1] === "B"
    )
      return true;
    return false;
  }
  return false;
};

const rookMovement = (
  color: string,
  initialRow: number,
  initialCol: number,
  finalRow: number,
  finalCol: number,
  chessState: Record<number, string>,
): boolean => {
  if (initialCol !== finalCol && initialRow !== finalRow) return false;
  if (initialCol === finalCol) {
    for (
      let i = Math.min(initialRow, finalRow) + 1;
      i < Math.max(initialRow, finalRow);
      i++
    ) {
      if (chessState[i * 10 + initialCol]) return false;
    }
    if (chessState[finalRow * 10 + finalCol]![1] !== color) return true;
    return false;
  } else if (initialRow === finalRow) {
    for (
      let i = Math.min(initialCol, finalCol) + 1;
      i < Math.max(initialCol, finalCol);
      i++
    ) {
      if (chessState[initialRow * 10 + i]) return false;
    }
    if (chessState[finalRow * 10 + finalCol]![1] !== color) return true;
  }
  return false;
};

const bishopMovement = (
  color: string,
  initialRow: number,
  initialCol: number,
  finalRow: number,
  finalCol: number,
  chessState: Record<number, string>,
): boolean => {
  if (chessState[finalRow * 10 + finalCol]![1] === color) return false;
  if (Math.abs(finalCol - initialCol) !== Math.abs(finalRow - initialRow))
    return false;

  let l = Math.abs(finalRow - initialRow);
  let colDir = initialCol - finalCol > 0 ? 1 : -1;
  let rowDir = initialRow - finalRow > 0 ? 1 : -1;

  for (let i = 1; i < l; i++) {
    if (chessState[(initialRow + rowDir * i) * 10 + (initialCol + colDir * i)])
      return false;
  }
  if (chessState[finalRow * 10 + finalCol]![1] === color) return false;
  return true;
};

const queenMovement = (
  color: string,
  initialRow: number,
  initialCol: number,
  finalRow: number,
  finalCol: number,
  chessState: Record<number, string>,
) => {
  return (
    bishopMovement(
      color,
      initialRow,
      initialCol,
      finalRow,
      finalCol,
      chessState,
    ) ||
    rookMovement(color, initialRow, initialCol, finalRow, finalCol, chessState)
  );
};

const knightMovement = (
  color: string,
  initialRow: number,
  initialCol: number,
  finalRow: number,
  finalCol: number,
  chessState: Record<number, string>,
) => {
  if (chessState[finalRow * 10 + finalCol]![1] === color) return false;

  const rowMovement = Math.abs(finalRow - initialRow);
  const colMovement = Math.abs(finalCol - initialCol);

  if (
    (rowMovement === 2 && colMovement === 1) ||
    (rowMovement === 1 && colMovement === 2)
  )
    return true;
  return false;
};

const kingMovement = (
  color: string,
  initialRow: number,
  initialCol: number,
  finalRow: number,
  finalCol: number,
  chessState: Record<number, string>,
) => {
  if (chessState[finalRow * 10 + finalCol]![1] === color) return false;

  const rowMovement = Math.abs(finalRow - initialRow);
  const colMovement = Math.abs(finalCol - initialCol);

  if (rowMovement < 2 && colMovement < 2) return true;
  return false;
};
