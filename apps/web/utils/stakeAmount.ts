import { erc20Abi } from "viem";
import { contractABI, usdContractAddress, contractAddress } from "./contractInfo";
import { number } from "motion/react";
import { writeContract } from '@wagmi/core';
import { config } from "./wagmiProvider";

const stakeAmount = async(amount : string, gameId : string, shareCount : string,  bet : number) => {

    const callApprove = await writeContract(config,{
        address : usdContractAddress,
        abi : erc20Abi,
        functionName : "approve",
        args : [contractAddress,BigInt(amount)]
    })

    console.log(callApprove);

    // const receipts = await useWaitForTransactionReceipt({hash : hash});
    const stakeTokens = await writeContract(config,{
        address  : contractAddress,
        abi : contractABI,
        functionName : "stakeAmount",
        args : [gameId,BigInt(shareCount),number,BigInt(amount)]
    })

    console.log(stakeTokens);
}