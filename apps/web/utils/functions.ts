import { readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core"
import { contractABI, contractAddress } from "./contractInfo"
import { config } from "./wagmiProvider"
import { Address } from "viem"

export const createGame = async(gameId : string) => {

    const result = await writeContract(config,{
        abi : contractABI,
        address : contractAddress,
        functionName : "createGame",
        args : [gameId]
    })

    const confirmation = await waitForTransactionReceipt(config,{
        hash : result
    })

    if(confirmation.status === "success") return {success : true};
    return {success : false}
}

export const getUserBet = async(gameId : string, userAddress : Address) => {

    const result = await readContract(config,{
        abi : contractABI,
        address : contractAddress,
        functionName : "getBet",
        args : [gameId,userAddress]
    })

    if(result) return {success : true, ...result};
    return {success : false};
}

export const getGame = async(gameId : string) => {
    const result = await readContract(config,{
        address : contractAddress,
        abi :contractABI,
        functionName : "getGame",
        args : [gameId]
    })


    if(result) return {success : true, ...result};
    return {success : false};
}


// here i need to add eth provider from ether.js will do later on.

// export const announceResult = async(gameId : string, winner : number) => {

//     const result = await writeContract(config,{
//         abi : contractABI,
//         address : contractAddress,
//         functionName : "resultAnnounced",
//         args : [gameId,winner],
//     });

//     // const provider =
// }

export const redeemAmount = async(gameId : string) => {
    const result = await writeContract(config,{
        address : contractAddress,
        abi : contractABI,
        functionName : "redeem",
        args : [gameId]
    })

    const confirmation = await waitForTransactionReceipt(config,{hash : result});

    if(confirmation.status === "success") return {success : true};
    return {success : false};
}

