import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { contractABI, contractAddress } from "./contractInfo";
import { config } from "./wagmiProvider";
import { Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import axios from "axios";

export const getUserBet = async (gameId: string, userAddress: Address) => {
  try {
    const result = await readContract(config, {
      abi: contractABI,
      address: contractAddress,
      functionName: "getBet",
      args: [gameId, userAddress],
    });

    if (result) return { success: true, ...result };
    return { success: false };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const getGame = async (gameId: string) => {
  try {
    const result = await readContract(config, {
      address: contractAddress,
      abi: contractABI,
      functionName: "getGame",
      args: [gameId],
    });
    if (result) return { success: true, ...result };
    return { success: false };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

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
//

const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_SERVER;
const ep = "/api/v1/user/redeem";

const _dbredeemAmount = async (gameId: string, userId: string) => {
  try {
    const response = await axios.post(`${HTTP_URL}${ep}`, {
      matchId: gameId,
      userId: userId,
    });
    if (response.data.success) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const redeemAmount = async (gameId: string, userId: string) => {
  try {
    if (!gameId || !userId) {
      return { success: false };
    }
    const result = await writeContract(config, {
      address: contractAddress,
      abi: contractABI,
      functionName: "redeem",
      args: [gameId],
    });

    const confirmation = await waitForTransactionReceipt(config, {
      hash: result,
    });
    const { success: _dbConfirm } = await _dbredeemAmount(gameId, userId);
    if (confirmation.status === "success" && _dbConfirm)
      return { success: true };
    return { success: false };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const ecryptAdmin = async (message: string): Promise<Address> => {
  const privateKey: Address = process.env.NEXT_PUBLIC_PRIVATE_KEY! as Address;
  const account = privateKeyToAccount(privateKey);
  const hash = await account.signMessage({ message: message });
  return hash;
};
