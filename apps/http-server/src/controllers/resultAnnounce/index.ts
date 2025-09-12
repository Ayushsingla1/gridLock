import { ethers } from "ethers";
import { abi, contractAddress } from "./info";
// import prisma from "@repo/db/dbClient";
import { MatchSchema } from "@repo/types";

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

export const createGame = async(gameId : string, updatedMatch: MatchSchema) => {
    try{
        console.log("result: ", updatedMatch);

        if(!updatedMatch || !(updatedMatch.status == "Scheduled")) return {status: 404, success : false, msg : "match not found or not scheduled"};
        const result2 = await contract.createGame!(updatedMatch.id);
        const confirmation = await result2.waitForTransactionReceipt();
        if(confirmation) {return {status: 200, success : true, msg : "Game created Successfully", id : updatedMatch.id}};

    }catch(e){
        return {status:500, success : false, msg : "error while writing to blockchain", error : e};
    }
}


export const decryptMsg = (hash : string, message : string) : boolean => {
    const publicKey = wallet.address;
    const result = ethers.verifyMessage(hash,message);
    if(result === publicKey) return true;
    return false;
}

