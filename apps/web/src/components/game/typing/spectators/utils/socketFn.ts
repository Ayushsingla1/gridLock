import { cursorPositions, Match, typingRecMsg } from "@/types/gameTypes";
import axios from "axios";
import { AES } from "crypto-js";
import CryptoJS from "crypto-js";
import { Dispatch, SetStateAction } from "react";

const ep = "/api/v1/room/getMatchInfo";
const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_SERVER;
const secretKey = process.env.NEXT_ENCRYPTION_SECRET || "SECRET";

export const listenTypingSocket = (
  socket: WebSocket,
  matchDetails: Match | null,
  setUser1Position: Dispatch<SetStateAction<cursorPositions>>,
  setUser2Position: Dispatch<SetStateAction<cursorPositions>>,
  setLoadingDetails: Dispatch<SetStateAction<boolean>>,
  roomId: string,
  setMatchDetails: Dispatch<SetStateAction<Match | null>>,
) => {
  socket.onmessage = (ev: MessageEvent) => {
    const decryptedMsgBytes = AES.decrypt(ev.data, secretKey);
    const decryptedMsg = decryptedMsgBytes.toString(CryptoJS.enc.Utf8);
    const recMsg = JSON.parse(decryptedMsg as string) as typingRecMsg;
    if (recMsg.user == matchDetails?.user1_Id) {
      setUser1Position({
        pointerPos: recMsg.pointerPos,
        currentWord: recMsg.currentWord,
        prevLetters: recMsg.prevLetters,
      });
    } else if (recMsg.user == matchDetails?.user2_Id) {
      setUser2Position({
        pointerPos: recMsg.pointerPos,
        currentWord: recMsg.currentWord,
        prevLetters: recMsg.prevLetters,
      });
    }
    if (recMsg.isComplete) {
      setLoadingDetails(true);
      axios
        .get(`${HTTP_URL}${ep}`, {
          params: {
            roomId,
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.success) {
            setMatchDetails(res.data.roomDetails);
          }
        })
        .finally(() => {
          setLoadingDetails(false);
        });
    }
  };
};
