"use client";
import ChessBox from "@/components/game/chess/player/chessBoard";
import useSocket from "@/hooks/socket";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { message } from "../typing/page";
import { AES } from "crypto-js";

const Chess = () => {
  const arr = useMemo(() => {
    const elements = [];
    for (let i = 1; i <= 8; i++) {
      for (let j = 1; j <= 8; j++) {
        elements.push(i * 10 + j);
      }
    }
    return elements;
  }, []);

  const [chessState, setChessState] = useState<Record<number, string>>();
  const { user, isLoaded, isSignedIn } = useUser();
  const WSS_URL = process.env.NEXT_PUBLIC_WSS_SERVER;
  const url = `${WSS_URL}`;
  const socketRef = useRef<WebSocket>(null);
  const router = useRouter();
  const { socket, loading } = useSocket(url, socketRef);

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
      const msg: message = {
        userId: user.username!,
        gameId: "chess",
        role: "Player",
        challengeId: "",
        msg: "Join Room",
      };
      socket?.send(JSON.stringify(msg));
    }
  }, [isLoaded, socket, loading, isSignedIn]);

  if (socketRef.current) {
    socketRef.current.onmessage = async (ev: MessageEvent) => {
      const decryptedMsg = JSON.parse(
        await AES.decrypt(ev.data, "SECRET").toString(CryptoJS.enc.Utf8),
      );
      setChessState(decryptedMsg.chessState);
    };
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[90vh] h-[90vh] grid grid-cols-8 m-0 p-0 gap-y-1 gap-x-1 bg-yellow-950">
        {arr.map((item, index) => (
          <ChessBox
            key={index}
            boxNumber={item}
            chessBoxState={chessState![index]}
            socketRef={socketRef}
          />
        ))}
      </div>
    </div>
  );
};

export default Chess;
