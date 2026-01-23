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
  boardRotation,
  isSpectator,
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
  boardRotation: string;
  isSpectator: boolean;
}) => {
  const clickHandler = () => {
    console.log(isSpectator);
    if (isSpectator) return;
    if (
      !enabled &&
      clicked &&
      chessState[clicked] &&
      isValid(chessState[clicked]!, clicked, boxNumber, chessState)
    ) {
      const socketMsg = JSON.stringify({
        role: role.Player,
        gameId: 2,
        challengeId: challengeId,
        userId: userId,
        msg: JSON.stringify({
          initialPos: clicked,
          finalPos: boxNumber,
          piece: chessState[clicked]!,
        }),
      });
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

  const isDark = (Math.floor(boxNumber / 10) + boxNumber) % 2 !== 0;
  const isSelected = clicked === boxNumber;

  const renderPiece = () => {
    const colorClass = chessBoxState.startsWith("W")
      ? "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
      : "text-gray-900";
    const iconProps = {
      className: `w-[85%] h-[85%] ${colorClass} transition-all duration-200`,
    };
    const rotationStyle = boardRotation === "W" ? "rotate-180" : "";

    return (
      <div
        className={`w-full h-full flex items-center justify-center ${rotationStyle}`}
      >
        {chessBoxState[1] === "K" ? (
          <TbChessKingFilled {...iconProps} />
        ) : chessBoxState[1] === "Q" ? (
          <TbChessQueenFilled {...iconProps} />
        ) : chessBoxState[1] === "R" ? (
          <TbChessRookFilled {...iconProps} />
        ) : chessBoxState[1] === "H" ? (
          <TbChessKnightFilled {...iconProps} />
        ) : chessBoxState[1] === "B" ? (
          <TbChessBishopFilled {...iconProps} />
        ) : chessBoxState !== "P" ? (
          <TbChessFilled {...iconProps} />
        ) : null}
      </div>
    );
  };

  return !isSpectator ? (
    <div
      onClick={clickHandler}
      className={`
        relative flex items-center justify-center aspect-square cursor-pointer select-none transition-all
        ${isDark ? "bg-[#769656]" : "bg-[#eeeed2]"}
        ${isSelected ? "ring-inset ring-8 ring-yellow-400/50" : ""}
        ${enabled ? "hover:brightness-105 active:scale-95" : ""}
      `}
    >
      {possibleMove && (
        <div className="absolute z-10 w-1/3 h-1/3 rounded-full bg-black/10 backdrop-blur-sm border-2 border-black/5" />
      )}
      {renderPiece()}
    </div>
  ) : (
    <div
      className={`
          relative flex items-center justify-center aspect-square cursor-pointer select-none transition-all
          ${isDark ? "bg-[#769656]" : "bg-[#eeeed2]"}
        `}
    >
      {renderPiece()}
    </div>
  );
};

export default ChessBox;
