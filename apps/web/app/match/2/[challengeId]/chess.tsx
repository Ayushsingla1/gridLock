"use client";
import ChessBox from "@/components/game/chess/player/chessBoard";
import useSocket from "@/hooks/socket";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { AES } from "crypto-js";
import { message } from "../../1/[challengeId]/gameLogic";
import { role } from "@/types/gameTypes";
import CryptoJS from "crypto-js";

const Chess = ({ roomId }: { roomId: string }) => {
  // const { challengeId, gameId } = params;

  console.log(roomId);
  const arr = useMemo(() => {
    const elements = [];
    for (let i = 1; i <= 8; i++) {
      for (let j = 1; j <= 8; j++) {
        elements.push(i * 10 + j);
      }
    }
    return elements;
  }, []);

  const [chessState, setChessState] = useState<Record<number, string>>({
    85: "BK",
    14: "WK",
    84: "BQ",
    15: "WQ",
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
    21: "WP1",
    71: "BP1",
    22: "WP2",
    72: "BP2",
    23: "WP3",
    73: "BP3",
    24: "WP4",
    74: "BP4",
    25: "WP5",
    75: "BP5",
    26: "WP6",
    76: "BP6",
    27: "WP7",
    77: "BP7",
    28: "WP8",
    78: "BP8",
  });
  const { user, isLoaded, isSignedIn } = useUser();
  const WSS_URL = process.env.NEXT_PUBLIC_WSS_SERVER;
  const url = `${WSS_URL}`;
  const socketRef = useRef<WebSocket>(null);
  const router = useRouter();
  const { socket, loading } = useSocket(url, socketRef);
  const [turn, setTurn] = useState<string>("W");
  const [color, setColor] = useState<string>("W");
  const [clicked, setClicked] = useState<number | undefined>();

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        console.log("not signed in!");
        router.push("/");
      }
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (isLoaded && isSignedIn && socket && !loading) {
      const socketMsg: message = {
        userId: user.username!,
        gameId: "chess",
        role: role.Player,
        challengeId: roomId,
        msg: "Join Room",
      };
      const encryptedMsg = AES.encrypt(
        JSON.stringify(socketMsg),
        "SECRET",
      ).toString();

      if (socket.readyState === socket.OPEN) {
        console.log("sending room joining message");
        socket.send(encryptedMsg);
      }
    }
  }, [isLoaded, socket, loading, isSignedIn, socket?.readyState, user, roomId]);

  if (socketRef.current) {
    socketRef.current.onmessage = async (ev: MessageEvent) => {
      console.log("message aa gya");
      // console.log(ev.data);
      const decryptedMsg = await JSON.parse(
        AES.decrypt(ev.data, "SECRET").toString(CryptoJS.enc.Utf8) as string,
      );
      // console.log(decryptedMsg);
      if (decryptedMsg.status && decryptedMsg.status === "Joined") {
        setColor(decryptedMsg.color);
        setChessState(decryptedMsg.chessState);
        setClicked(undefined);
        setTurn(decryptedMsg.turn);
        return;
      }
      if (decryptedMsg.turn) {
        setTurn(decryptedMsg.turn);
      }
      if (decryptedMsg.chessState) setChessState(decryptedMsg.chessState);
    };
  }
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div
        className={`w-[90vh] h-[90vh] grid grid-cols-8 m-0 p-0 gap-y-1 gap-x-1 bg-yellow-950 ${color === "W" && "rotate-180"}`}
      >
        {arr.map((item, index) => (
          <ChessBox
            key={index}
            boxNumber={item}
            chessBoxState={chessState![item]?.substring(0, 2) || "P"}
            socketRef={socketRef}
            clicked={clicked}
            setClicked={setClicked}
            turn={color}
            enabled={
              turn === color &&
              (chessState![item] === undefined
                ? false
                : chessState[item]![0] === color)
            }
            userId={user?.username!}
            chessState={chessState}
            challengeId={roomId}
          />
        ))}
      </div>
    </div>
  );
};

export default Chess;
