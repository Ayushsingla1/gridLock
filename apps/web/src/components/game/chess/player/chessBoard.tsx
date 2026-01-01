"use client";

import { RefObject } from "react";
import {
  TbChessBishopFilled,
  TbChessBishop,
  TbChess,
  TbChessFilled,
  TbChessKing,
  TbChessKingFilled,
  TbChessQueen,
  TbChessQueenFilled,
  TbChessRook,
  TbChessRookFilled,
  TbChessKnight,
  TbChessKnightFilled,
} from "react-icons/tb";

const ChessBox = ({
  boxNumber,
  chessBoxState,
  socketRef,
}: {
  boxNumber: number;
  chessBoxState: string;
  socketRef: RefObject<WebSocket | null>;
}) => {
  console.log(boxNumber, chessBoxState);
  return (
    <div
      className={`px-0 mx-0 flex justify-center items-center ${(Math.floor(boxNumber / 10) + (boxNumber % 10)) % 2 === 0 ? "bg-[#779457]" : "bg-[#EBEDD1]"} relative`}
    >
      {chessBoxState === "P" ? (
        <></>
      ) : chessBoxState === "BK" ? (
        <TbChessKingFilled className="fill-[#565452] absolute w-full h-full" />
      ) : chessBoxState === "WK" ? (
        <TbChessKingFilled className="fill-[#F9F9F9] absolute w-full h-full" />
      ) : chessBoxState === "BR" ? (
        <TbChessRookFilled className="fill-[#565452] absolute w-full h-full" />
      ) : chessBoxState === "WR" ? (
        <TbChessRookFilled className="fill-[#F9F9F9] absolute w-full h-full" />
      ) : chessBoxState === "BH" ? (
        <TbChessKnightFilled className="fill-[#565452] absolute w-full h-full" />
      ) : chessBoxState === "WH" ? (
        <TbChessKnightFilled className="fill-[#F9F9F9] absolute w-full h-full" />
      ) : chessBoxState === "BQ" ? (
        <TbChessQueenFilled className="fill-[#565452] absolute w-full h-full" />
      ) : chessBoxState === "WQ" ? (
        <TbChessQueenFilled className="fill-[#F9F9F9] absolute w-full h-full" />
      ) : chessBoxState === "BB" ? (
        <TbChessBishopFilled className="fill-[#565452] absolute w-full h-full" />
      ) : chessBoxState === "WB" ? (
        <TbChessBishopFilled className="fill-[#F9F9F9] absolute w-full h-full" />
      ) : chessBoxState === "BP" ? (
        <TbChessFilled className="fill-[#565452] absolute w-full h-full" />
      ) : (
        <TbChessFilled className="fill-[#F9F9F9] absolute w-full h-full" />
      )}
    </div>
  );
};

export default ChessBox;
