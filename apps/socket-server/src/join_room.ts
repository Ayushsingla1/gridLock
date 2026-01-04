import prisma from "@repo/db/dbClient";
import { message, role, Rooms } from "./index";
import WebSocket from "ws";
import { AES } from "crypto-js";
import { JoinMsgHandler } from "./chessJoinMsg";

export const room_join = async (info: message, wss: WebSocket) => {
  if (Rooms.has(info.challengeId)) {
    const roomInfo = Rooms.get(info.challengeId)!;
    console.log("start: ", roomInfo);
    if (info.role === role.Player) {
      if (info.userId === roomInfo.user1) {
        Rooms.set(info.challengeId, {
          ...Rooms.get(info.challengeId)!,
          user1_joined: true,
          user1_socket: wss,
        });
        if (info.gameId === "chess")
          JoinMsgHandler(wss, info.userId, info.challengeId);
        console.log("user 1 joined: ", Rooms.get(info.challengeId));
      } else if (info.userId === roomInfo.user2) {
        Rooms.set(info.challengeId, {
          ...Rooms.get(info.challengeId)!,
          user2_joined: true,
          user2_socket: wss,
        });
        if (info.gameId === "chess")
          if (Rooms.get(info.challengeId)?.chessState)
            JoinMsgHandler(wss, info.userId, info.challengeId);
        console.log("user 2 joined: ", Rooms.get(info.challengeId));
      } else wss.close();
    } else if (info.role === role.Spectator) {
      if (info.userId === roomInfo.user1 || info.userId === roomInfo.user2) {
        console.log("closed");
        wss.close();
      } else if (roomInfo?.spectators.has(info.userId)) {
        Rooms.set(info.challengeId, {
          ...roomInfo,
          spectators: roomInfo.spectators.set(info.userId, wss),
        });
        console.log("already in the room");
        // wss.close();
      } else {
        Rooms.set(info.challengeId, {
          ...roomInfo,
          spectators: roomInfo.spectators.set(info.userId, wss),
        });
      }
    }
    console.log("inside room_join: ", roomInfo);
  } else {
    const challenge = await prisma.match.findFirst({
      where: {
        id: info.challengeId,
      },
    });
    if (challenge?.status == "Completed") {
      console.log("Game's conclusion already reached");
      wss.close();
    }
    if (challenge) {
      Rooms.set(info.challengeId, {
        user1: challenge.user1_Id,
        user2: challenge.user2_Id,
        user1_joined: false,
        user2_joined: false,
        spectators: new Map<string, WebSocket>(),
        user1_socket: null,
        user2_socket: null,
      });

      if (info.role === role.Player && info.userId === challenge.user1_Id) {
        Rooms.set(info.challengeId, {
          ...Rooms.get(info.challengeId)!,
          user1: challenge.user1_Id,
          user1_joined: true,
          user1_socket: wss,
        });
        if (info.gameId === "chess")
          JoinMsgHandler(wss, info.userId, info.challengeId);
        console.log("user 1 joined: ", Rooms.get(info.challengeId));
      } else if (
        info.role === role.Player &&
        info.userId === challenge.user2_Id
      ) {
        Rooms.set(info.challengeId, {
          ...Rooms.get(info.challengeId)!,
          user2: challenge.user2_Id,
          user2_joined: true,
          user2_socket: wss,
        });
        if (info.gameId === "chess")
          JoinMsgHandler(wss, info.userId, info.challengeId);
        console.log("user 2 joined: ", Rooms.get(info.challengeId));
      } else if (
        info.role === role.Spectator &&
        (info.userId !== challenge.user1_Id ||
          info.userId !== challenge.user2_Id)
      ) {
        const roomInfo = Rooms.get(info.challengeId);
        Rooms.set(info.challengeId, {
          ...roomInfo!,
          spectators: roomInfo?.spectators.set(info.userId, wss)!,
        });
      }
    } else {
      console.log("closed");
      wss.close(1002, "No such room exists");
    }
    console.log(
      "inside room_join for the first time: ",
      Rooms.get(info.challengeId),
    );
  }
};
