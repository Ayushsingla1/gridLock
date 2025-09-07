import { ethers } from "ethers";
import { abi, contractAddress } from "./utils/contractInfo";
// import prisma from "@repo/db/dbClient";
// import { MatchSchema } from "@repo/types";
import { configDotenv } from "dotenv";
configDotenv()

const privateKey = process.env.PRIVATE_KEY!;
const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc")
const wallet = new ethers.Wallet(privateKey,provider);
const contract = new ethers.Contract(contractAddress,abi,wallet);

export const announceResult = async(gameId : string, winner : number) => {
    try {
        const tx = await contract.resultAnnounced!(gameId,winner);
        const res = await tx.waitForTransactionReceipt();
        if(res) return {success : true};
        
    } catch (e) {
        return {success : false, error : e, msg : "try again later"};
    }
}