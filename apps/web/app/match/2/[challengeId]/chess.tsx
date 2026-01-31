"use client";
import ChessBox from "@/components/game/chess/player/chessBoard";
import useSocket from "@/hooks/socket";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { AES } from "crypto-js";
import { role } from "@/types/gameTypes";
import CryptoJS from "crypto-js";
import {
  TbChessFilled,
  TbChessKnightFilled,
  TbChessBishopFilled,
  TbChessRookFilled,
  TbChessQueenFilled,
} from "react-icons/tb";

const FULL_SET = [
  "WP1",
  "WP2",
  "WP3",
  "WP4",
  "WP5",
  "WP6",
  "WP7",
  "WP8",
  "WR1",
  "WR2",
  "WH1",
  "WH2",
  "WB1",
  "WB2",
  "WQ",
  "BP1",
  "BP2",
  "BP3",
  "BP4",
  "BP5",
  "BP6",
  "BP7",
  "BP8",
  "BR1",
  "BR2",
  "BH1",
  "BH2",
  "BB1",
  "BB2",
  "BQ",
];

const CapturedBar = ({
  pieces,
  label,
  side,
}: {
  pieces: string[];
  label: string;
  side: "left" | "right";
}) => {
  const icons: any = {
    P: TbChessFilled,
    H: TbChessKnightFilled,
    B: TbChessBishopFilled,
    R: TbChessRookFilled,
    Q: TbChessQueenFilled,
  };
  return (
    <div className="hidden lg:flex flex-col items-center py-6 w-20 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl self-stretch">
      <span className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-4 rotate-90">
        {label}
      </span>
      <div className="flex flex-col gap-3 mt-4 overflow-y-auto no-scrollbar">
        {pieces.map((p, i) => {
          const Icon = icons[p[1]!] || TbChessFilled;
          return (
            <Icon
              key={i}
              className={`text-3xl transition-transform hover:scale-110 ${p[0] === "W" ? "text-white drop-shadow-md" : "text-slate-900"}`}
            />
          );
        })}
      </div>
    </div>
  );
};

const Chess = ({
  roomId,
  isSpectator,
}: {
  roomId: string;
  isSpectator: boolean;
}) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const socketRef = useRef<WebSocket>(null);
  const router = useRouter();
  const { socket, loading } = useSocket(
    process.env.NEXT_PUBLIC_WSS_SERVER!,
    socketRef,
  );

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
  const [turn, setTurn] = useState("W");
  const [color, setColor] = useState("W");
  const [clicked, setClicked] = useState<number>();
  const [possibleMoves, setPossibleMoves] = useState<Set<number>>();

  const arr = useMemo(() => {
    const elements = [];
    for (let i = 1; i <= 8; i++)
      for (let j = 1; j <= 8; j++) elements.push(i * 10 + j);
    return elements;
  }, []);

  const captured = useMemo(() => {
    const current = Object.values(chessState);
    const lost = FULL_SET.filter((p) => !current.includes(p));
    return {
      white: lost.filter((p) => p[0] === "W"),
      black: lost.filter((p) => p[0] === "B"),
    };
  }, [chessState]);

  // Existing logic for socket...
  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/");
  }, [isLoaded, isSignedIn]);
  useEffect(() => {
    if (isLoaded && isSignedIn && socket && !loading) {
      const msg = AES.encrypt(
        JSON.stringify({
          userId: user.username!,
          gameId: 2,
          role: isSpectator ? role.Spectator : role.Player,
          challengeId: roomId,
          msg: "Join Room",
        }),
        "SECRET",
      ).toString();
      if (socket.readyState === socket.OPEN) socket.send(msg);
    }
  }, [isLoaded, socket, loading, isSignedIn, user, roomId]);

  if (socketRef.current) {
    socketRef.current.onmessage = async (ev) => {
      const dec = JSON.parse(
        AES.decrypt(ev.data, "SECRET").toString(CryptoJS.enc.Utf8),
      );

      console.log(dec);
      if (dec.status == "Joined") {
        setColor(dec.color);
        setChessState(dec.chessState);
        setTurn(dec.turn);
        return;
      }
      if (dec.turn) setTurn(dec.turn);
      if (dec.chessState) setChessState(dec.chessState);
    };
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1c2c] via-[#2a2d4a] to-[#1a1c2c] flex items-center justify-center p-4 lg:p-10 overflow-hidden">
      <div className="flex flex-row items-center justify-center gap-6 w-full max-w-7xl h-full max-h-[900px]">
        {/* Left Sidebar - Captured Black Pieces */}
        <CapturedBar
          pieces={captured.black}
          label="Defeated Black"
          side="left"
        />

        {/* Main Chess Arena */}
        <div className="flex flex-col items-center gap-6 flex-1">
          <div className="flex justify-between w-full max-w-[800px] px-2">
            <h2 className="text-white/80 font-bold tracking-widest uppercase text-sm">
              Room: {roomId}
            </h2>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${turn === color ? "bg-green-400 shadow-[0_0_10px_#4ade80]" : "bg-red-400"}`}
              />
              <span className="text-white text-sm font-semibold">
                {turn === color ? "YOUR MOVE" : "WAITING..."}
              </span>
            </div>
          </div>

          <div className="relative group shadow-[0_40px_100px_rgba(0,0,0,0.6)] border-[16px] border-[#312e2b] rounded-lg">
            <div
              className={`grid grid-cols-8 w-[90vw] h-[90vw] md:w-[75vh] md:h-[75vh] max-w-[800px] max-h-[800px] transition-transform duration-700 ${color === "W" ? "rotate-180" : ""}`}
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
                  boardRotation={color}
                  enabled={
                    turn === color &&
                    (chessState![item] ? chessState[item]![0] === color : false)
                  }
                  userId={user?.username!}
                  chessState={chessState}
                  challengeId={roomId}
                  possibleMove={possibleMoves?.has(item) || false}
                  setPossibleMove={setPossibleMoves}
                  isSpectator={isSpectator}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Captured White Pieces */}
        <CapturedBar
          pieces={captured.white}
          label="Defeated White"
          side="right"
        />
      </div>
    </div>
  );
};

export default Chess;
