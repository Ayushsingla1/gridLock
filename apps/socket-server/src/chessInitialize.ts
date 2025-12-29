export const initializeChess = () => {
  const chessState: Record<number, string> = {
    15: "BK",
    84: "WK",
    14: "BQ",
    85: "WQ",
    11: "WR1",
    18: "WR2",
    13: "WB1",
    16: "WB2",
    12: "WH1",
    17: "WH2",
    81: "BR1",
    88: "BR2",
    83: "BB1",
    86: "BB2",
    82: "BH1",
    87: "BH2",
  };

  for (let i = 1; i <= 8; i++) {
    const whitePiece = "WP" + i;
    const blackPiece = "BP" + i;
    chessState[20 + i] = whitePiece;
    chessState[70 + i] = blackPiece;
  }

  return chessState;
};
