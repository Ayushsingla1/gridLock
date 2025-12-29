import { message, role, Rooms } from ".";
import { initializeChess } from "./chessInitialize";

export const chessHandler = async (info: message, wss: WebSocket) => {
  const { gameId, challengeId, msg, userId, password } = info;

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

  const state = Rooms.get(challengeId);
  let chessState = state?.chessState;

  if (!chessState) {
    chessState = initializeChess();
    Rooms.set(challengeId, {
      ...state!,
      chessState: chessState,
    });
  }

  const piece = decodedMessage.piece;
  const color = piece[0];
  const initialPos: number = decodedMessage.initialPos;
  const finalPos: number = decodedMessage.finalPos;
  const currPiece: string = chessState[initialPos]!;
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
    chessState[finalPos] = piece;
    delete chessState[initialPos];
  } else {
    wss.close();
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
  if (initialRow === 2 && color === "W") {
    // single step forward or two step forward
    if (
      finalCol === initialCol &&
      (finalRow === initialRow + 1 || finalRow === initialRow + 2) &&
      !chessState[finalRow * 10 + finalCol] &&
      !chessState[(initialRow + 1) * 10 + finalCol]
    )
      return true;
    // diagonal move
    if (
      (finalCol === initialCol - 1 || finalCol === initialCol + 1) &&
      finalRow === initialRow + 1 &&
      chessState[finalRow * 10 + finalCol]
    )
      return true;
    return false;
  } else if (initialRow === 7 && color === "B") {
    // single step forward or two step forward
    if (
      finalCol === initialCol &&
      (finalRow === initialRow + 1 || finalRow === initialRow + 2) &&
      !chessState[finalRow * 10 + finalCol] &&
      !chessState[(initialRow + 1) * 10 + finalCol]
    )
      return true;
    // diagonal move
    if (
      (finalCol === initialCol - 1 || finalCol === initialCol + 1) &&
      finalRow === initialRow + 1 &&
      chessState[finalRow * 10 + finalCol]
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
      finalRow === initialRow + 1 &&
      chessState[finalRow * 10 + finalCol]
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
      chessState[finalRow * 10 + finalCol]
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
    if (chessState[finalRow * 10 + finalCol]![0] !== color) return true;
    return false;
  } else if (initialRow === finalRow) {
    for (
      let i = Math.min(initialCol, finalCol) + 1;
      i < Math.max(initialCol, finalCol);
      i++
    ) {
      if (chessState[initialRow * 10 + i]) return false;
    }
    if (chessState[finalRow * 10 + finalCol]![0] !== color) return true;
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
  if (chessState[finalRow * 10 + finalCol]![0] === color) return false;
  if (Math.abs(finalCol - initialCol) !== Math.abs(finalRow - initialRow))
    return false;

  let l = Math.abs(finalRow - initialRow);
  let colDir = initialCol - finalCol > 0 ? 1 : -1;
  let rowDir = initialRow - finalRow > 0 ? 1 : -1;

  for (let i = 1; i < l; i++) {
    if (chessState[(initialRow + rowDir * i) * 10 + (initialCol + colDir * i)])
      return false;
  }
  if (chessState[finalRow * 10 + finalCol]![0] === color) return false;
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
