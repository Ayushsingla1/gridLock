"use client";

import React, { Dispatch, RefObject, SetStateAction } from "react";
import {
  TbChessBishopFilled,
  TbChessFilled,
  TbChessKingFilled,
  TbChessQueenFilled,
  TbChessRookFilled,
  TbChessKnightFilled,
} from "react-icons/tb";
import { isValid } from "@repo/checks";
import { AES } from "crypto-js";
import { role } from "@/types/gameTypes";
import { getPossibleMoves } from "./possibleMoves";

const ChessBox = ({
  boxNumber,
  chessBoxState,
  socketRef,
  clicked,
  setClicked,
  enabled,
  userId,
  turn,
  chessState,
  challengeId,
  possibleMove,
  setPossibleMove,
}: {
  boxNumber: number;
  chessBoxState: string;
  socketRef: RefObject<WebSocket | null>;
  clicked: number | undefined;
  setClicked: Dispatch<SetStateAction<number | undefined>>;
  enabled: boolean;
  userId: string;
  turn: string;
  chessState: Record<number, string>;
  challengeId: string;
  possibleMove: boolean;
  setPossibleMove: Dispatch<SetStateAction<Set<number> | undefined>>;
}) => {
  // console.log(boxNumber, enabled);
  const clickHandler = () => {
    if (
      !enabled &&
      clicked &&
      chessState[clicked] &&
      isValid(chessState[clicked]!, clicked, boxNumber, chessState)
    ) {
      console.log("possible move, moving");
      // this is a move... need to send a message to socket server
      //
      setClicked(undefined);
      const socketMsg = JSON.stringify({
        role: role.Player,
        gameId: "chess",
        challengeId: challengeId,
        userId: userId,
        msg: JSON.stringify({
          initialPos: clicked,
          finalPos: boxNumber,
          piece: chessState[clicked]!,
        }),
      });
      console.log("sending message : ", socketMsg);

      const encryptedMsg = AES.encrypt(socketMsg, "SECRET").toString();

      if (socketRef.current?.readyState === socketRef.current?.OPEN) {
        socketRef.current?.send(encryptedMsg);
      }

      setClicked(undefined);
      setPossibleMove(undefined);
    }
    if (enabled) {
      setClicked(boxNumber);
      setPossibleMove(getPossibleMoves(boxNumber, chessState));
    }
  };
  return (
    <div
      className={`px-0 mx-0 flex justify-center items-center ${boxNumber === clicked ? "bg-blue-400" : possibleMove ? "bg-blue-200" : (Math.floor(boxNumber / 10) + (boxNumber % 10)) % 2 === 0 ? "bg-[#779457]" : "bg-red-400"} relative ${turn === "W" && "rotate-180"}`}
      onClick={clickHandler}
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
