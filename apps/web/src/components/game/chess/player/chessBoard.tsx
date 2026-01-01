"use client";

import React, { Dispatch, RefObject, SetStateAction, useState } from "react";
import {
  TbChessBishopFilled,
  TbChessFilled,
  TbChessKingFilled,
  TbChessQueenFilled,
  TbChessRookFilled,
  TbChessKnightFilled,
} from "react-icons/tb";

const ChessBox = ({
  boxNumber,
  chessBoxState,
  socketRef,
  clicked,
  setClicked,
  enabled,
}: {
  boxNumber: number;
  chessBoxState: string;
  socketRef: RefObject<WebSocket | null>;
  clicked: number | undefined;
  setClicked: Dispatch<SetStateAction<number | undefined>>;
  enabled: boolean;
}) => {
  console.log(boxNumber, enabled);
  const clickHandler = () => {
    if (enabled) {
      setClicked(boxNumber);
    }
  };
  return (
    <div
      className={`px-0 mx-0 flex justify-center items-center ${boxNumber === clicked ? "bg-blue-300" : (Math.floor(boxNumber / 10) + (boxNumber % 10)) % 2 === 0 ? "bg-[#779457]" : "bg-red-400"} relative`}
      onClick={(e) => clickHandler(e)}
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
