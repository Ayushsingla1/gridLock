"use client";

import { RefObject } from "react";

const ChessBox = ({
  boxNumber,
  chessBoxState,
  socketRef,
}: {
  boxNumber: number;
  chessBoxState: string;
  socketRef: RefObject<WebSocket | null>;
}) => {
  return (
    <div
      className={`px-0 mx-0 ${(Math.floor(boxNumber / 10) + (boxNumber % 10)) % 2 === 0 ? "bg-white" : "bg-black"}`}
    >
      {boxNumber}
    </div>
  );
};

export default ChessBox;
