import { ethers } from "ethers";
import { abi, contractAddress } from "./utils/contractInfo";
import { configDotenv } from "dotenv";
import { contract } from ".";
configDotenv();

export const announceResult = async (gameId: string, winner: number) => {
  try {
    // console.log(contract);
    const tx = await contract.resultAnnounced!(gameId, winner);
    const res = await tx.wait();
    if (res) return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false, error: e, msg: "try again later" };
  }
};
