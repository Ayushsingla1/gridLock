export const getPossibleMoves = (
  currPos: number,
  chessState: Record<number, string>,
): Set<number> => {
  const piece = chessState[currPos]!;
  const color = piece[0]!;
  const currRow = Math.floor(currPos / 10);
  const currCol = currPos % 10;

  if (piece[1] === "P") {
    return _pawnPossibleMoves(currRow, currCol, color, chessState);
  } else if (piece[1] === "H") {
    return _knightPossibleMoves(currRow, currCol, color, chessState);
  } else if (piece[1] === "R") {
    return _rookPossibleMoves(currRow, currCol, color, chessState);
  } else if (piece[1] === "B") {
    return _bishopPossibleMoves(currRow, currCol, color, chessState);
  } else if (piece[1] === "Q") {
    return _queenPossibleMoves(currRow, currCol, color, chessState);
  } else if (piece[1] === "K") {
    return _kingPossibleMoves(currRow, currCol, color, chessState);
  }
  return new Set([]);
};

const _pawnPossibleMoves = (
  currRow: number,
  currCol: number,
  color: string,
  chessState: Record<number, string>,
): Set<number> => {
  const arr: Set<number> = new Set();
  if (color === "B") {
    // for a black pawn
    if (currRow === 7 && !chessState[(currRow - 2) * 10 + currCol])
      arr.add((currRow - 2) * 10 + currCol);
    if (currRow !== 1 && !chessState[(currRow - 1) * 10 + currCol])
      arr.add((currRow - 1) * 10 + currCol);
    if (
      currRow !== 1 &&
      currCol !== 8 &&
      chessState[(currRow - 1) * 10 + (currCol + 1)] &&
      chessState[(currRow - 1) * 10 + (currCol + 1)]![0] !== color
    )
      arr.add((currRow - 1) * 10 + (currCol + 1));
    if (
      currRow !== 1 &&
      currCol !== 1 &&
      chessState[(currRow - 1) * 10 + (currCol - 1)] &&
      chessState[(currRow - 1) * 10 + (currCol - 1)]![0] !== color
    )
      arr.add((currRow - 1) * 10 + (currCol - 1));
  } else {
    if (currRow === 2 && !chessState[(currRow + 2) * 10 + currCol])
      arr.add((currRow + 2) * 10 + currCol);
    if (currRow !== 8 && !chessState[(currRow + 1) * 10 + currCol])
      arr.add((currRow + 1) * 10 + currCol);
    if (
      currRow !== 8 &&
      currCol !== 8 &&
      chessState[(currRow + 1) * 10 + (currCol + 1)] &&
      chessState[(currRow + 1) * 10 + (currCol + 1)]![0] !== color
    )
      arr.add((currRow + 1) * 10 + (currCol + 1));
    if (
      currRow !== 8 &&
      currCol !== 1 &&
      chessState[(currRow + 1) * 10 + (currCol - 1)] &&
      chessState[(currRow + 1) * 10 + (currCol - 1)]![0] !== color
    )
      arr.add((currRow + 1) * 10 + (currCol - 1));
  }

  return arr;
};

const knightOffsets = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];

const _knightPossibleMoves = (
  currRow: number,
  currCol: number,
  color: string,
  chessState: Record<number, string>,
): Set<number> => {
  const arr = new Set<number>();

  for (const [dr, dc] of knightOffsets) {
    const r = currRow + dr!;
    const c = currCol + dc!;

    if (r < 1 || r > 8 || c < 1 || c > 8) continue;

    const pos = r * 10 + c;
    const piece = chessState[pos];

    if (!piece || piece[0] !== color) {
      arr.add(pos);
    }
  }

  return arr;
};

const _rookPossibleMoves = (
  currRow: number,
  currCol: number,
  color: string,
  chessState: Record<number, string>,
): Set<number> => {
  const arr: Set<number> = new Set();

  const _checkRow = (i: number): boolean => {
    if (!chessState[i * 10 + currCol]) arr.add(i * 10 + currCol);
    else if (chessState[i * 10 + currCol]) {
      if (chessState[i * 10 + currCol]![0] === color) return true;
      else {
        arr.add(i * 10 + currCol);
        return true;
      }
    }
    return false;
  };

  const _checkCol = (i: number): boolean => {
    if (!chessState[currRow * 10 + i]) arr.add(currRow * 10 + i);
    else if (chessState[currRow * 10 + i]) {
      if (chessState[currRow * 10 + i]![0] === color) return true;
      else {
        arr.add(currRow * 10 + i);
        return true;
      }
    }
    return false;
  };

  for (let i = currRow + 1; i < 9; i++) {
    if (_checkRow(i)) break;
  }
  for (let i = currRow - 1; i > 0; i--) {
    if (_checkRow(i)) break;
  }
  for (let i = currCol + 1; i < 9; i++) {
    if (_checkCol(i)) break;
  }
  for (let i = currCol - 1; i > 0; i--) {
    if (_checkCol(i)) break;
  }
  return arr;
};

const _bishopPossibleMoves = (
  currRow: number,
  currCol: number,
  color: string,
  chessState: Record<number, string>,
): Set<number> => {
  const arr: Set<number> = new Set();

  const _checkDiagonal = (dr: number, dc: number) => {
    const row = currRow + dr;
    const col = currCol + dc;
    if (row < 1 || row > 8 || col < 1 || col > 8) return true;
    const state = (currRow + dr) * 10 + (currCol + dc);
    if (!chessState[state]) arr.add(state);
    else if (chessState[state]) {
      if (chessState[state]![0] === color) return true;
      else {
        arr.add(state);
        return true;
      }
    }
    return false;
  };

  for (let i = 1; i < 8; i++) {
    if (_checkDiagonal(i, -i)) break;
  }
  for (let i = 1; i < 8; i++) {
    if (_checkDiagonal(i, i)) break;
  }
  for (let i = 1; i < 8; i++) {
    if (_checkDiagonal(-i, i)) break;
  }
  for (let i = 1; i < 8; i++) {
    if (_checkDiagonal(-i, -i)) break;
  }
  return arr;
};

const _queenPossibleMoves = (
  currRow: number,
  currCol: number,
  color: string,
  chessState: Record<number, string>,
): Set<number> => {
  const arr1 = _bishopPossibleMoves(currRow, currCol, color, chessState);
  const arr2 = _rookPossibleMoves(currRow, currCol, color, chessState);
  const arr3 = new Set([...arr1, ...arr2]);
  return arr3;
};

const kingOffsets = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1],
];

const _kingPossibleMoves = (
  currRow: number,
  currCol: number,
  color: string,
  chessState: Record<number, string>,
): Set<number> => {
  const arr: Set<number> = new Set();

  for (const [dr, dc] of kingOffsets) {
    const r = currRow + dr!;
    const c = currCol + dc!;

    if (r < 1 || r > 8 || c < 1 || c > 8) continue;

    const pos = r * 10 + c;
    const piece = chessState[pos];

    if (!piece || piece[0] !== color) {
      arr.add(pos);
    }
  }
  return arr;
};
