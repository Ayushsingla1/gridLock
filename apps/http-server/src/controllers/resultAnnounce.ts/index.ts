import { ethers } from "ethers";
import { abi, contractAddress } from "./info";
import prisma from "@repo/db/dbClient";

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

export const createGame = async(gameId : string, ExpiresAt : Date, user1_id : string, user2_id : string) => {
    try{
        const result = await prisma.match.create({data: {
            gameId : gameId,
            ExpiresAt : ExpiresAt.toISOString(),
            user1_Id : user1_id,
            user2_Id : user2_id
        }})
    
        if(!result) return {success : false, msg : "Error while creating game in Db"};
    
        const result2 = await contract.createGame!(result.id);
        console.log(result2);
        const confirmation = await result2.waitForTransactionReceipt();
        console.log(confirmation);
        if(confirmation) {return {success : true, msg : "Game created Successfully", id : result.id}};

    }catch(e){
        return {success : false, msg : "try again later", error : e};
    }
}
