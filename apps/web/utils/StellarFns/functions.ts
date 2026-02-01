  import { signTransaction } from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";
import * as Client from "./mainContractBinding";
import * as USDClient from "./usdgContractBinding";
import { getAddress } from "@stellar/freighter-api";
import axios from "axios";

const rpcUrl = "https://soroban-testnet.stellar.org";
const contractAddress =
  "CDOI6BF4UT2DGZIDTQBLBLHL7Y6NVFO7JPPCYIW7ENO2JX7YLUROB2EP";
const signTransactionXDR = async (xdr: string, address: string) => {
  try {
    const signedXDR = await signTransaction(xdr, {
      networkPassphrase: StellarSdk.Networks.TESTNET,
      address: address,
    });

    const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
      signedXDR.signedTxXdr,
      StellarSdk.Networks.TESTNET,
    );

    const server = new StellarSdk.rpc.Server(rpcUrl);
    const result = await server.sendTransaction(signedTransaction);

    const resp = await server.pollTransaction(result.hash, {
      attempts: 10,
    });

    if (resp.status === "SUCCESS") {
      console.log("Transaction successful!", result);
      console.log("Transaction hash:", result.hash);
      return { success: true };
    }

    console.log(result);
    return { success: false };
  } catch (e) {
    console.log(e);
    return { success: false };
  }
};

export const getApproval = async (amount: bigint) => {
  const address = localStorage.getItem("WALLET_ADDRESS");
  if(!address) {
      console.log("address not found");
      return;
    }
  const contract = new USDClient.Client({
    rpcUrl: rpcUrl,
    publicKey: address,
    ...USDClient.networks.testnet,
  });

  const server = new StellarSdk.rpc.Server(rpcUrl);

  const expiration_ledger = await server.getLatestLedger();

  console.log(expiration_ledger);
  const assembledTx = await contract.approve({
    from: address,
    spender: contractAddress,
    amount: amount * BigInt(String(10 ** 7)),
    expiration_ledger: (await server.getLatestLedger()).sequence + 535680,
  });

  const xdr = assembledTx.toXDR();
  console.log(xdr);
  const result = await signTransactionXDR(xdr, address);
  console.log(result);
  return result;
};

export const getAmount = async (game_id: string, shares: number, bet: number) => {
  try {
    const contract = new Client.Client({
      rpcUrl: rpcUrl,
      ...Client.networks.testnet,
    });
    const { result: amount } = await contract.get_amount({
      game_id: game_id,
      bet: bet,
      shares: BigInt(String(shares)),
    });
    console.log("amount from getAmount is :" , amount);
      if(amount.isOk()){
        return { success: true, amount: amount.unwrap() };
      }
  } catch (e) {
    console.log(e);
    return { success: false };
  }
};

export const tx = async (game_id: string, shares: number, bet: number) => {
  // game_id = "6a99edbd-a49a-4f3e-b3f5-160556b4f90c";
  const address = localStorage.getItem("WALLET_ADDRESS");

  console.log(address);
  if (!address) {
    console.log("wallet not connected");
    return;
  }

  const contract = new Client.Client({
    rpcUrl: rpcUrl,
    publicKey: address,
    ...Client.networks.testnet,
  });

  const getAmountResult = await getAmount(game_id, shares, bet);
  console.log(getAmountResult);

  if (!getAmountResult?.success) {
    console.log("unable to fetch amount");
    return { success: false };
  }

  const allowance = await getApproval(getAmountResult.amount!);
  console.log(allowance);
  if (!allowance.success) {
    console.log("failed to get allowance");
  }

  const assembledTx = await contract.stake_amount({
    game_id: game_id,
    shares: BigInt(String(shares)),
    bet: bet,
    amount: getAmountResult.amount!,
    staker: address,
  });

  const xdr = assembledTx.toXDR();
  const res = await signTransactionXDR(xdr, address);
  console.log(res);
  return res;
}

export const stakeAmount = async (game_id: string, shares: number, bet: number, address: string, amount: number) => {
  const contract = new Client.Client({
    rpcUrl: rpcUrl,
    publicKey: address,
    ...Client.networks.testnet,
  });
  const tx = await contract.stake_amount({
    game_id: game_id,
    shares: BigInt(String(shares)),
    bet: bet,
    amount: BigInt(amount),
    staker: address,
  });

  if(tx.result.isOk()){
      return {success:true, response: tx.result.unwrap()};
  }
  else return {success: false}
}

export const getGame = async (game_id: string) : Promise<{
    success : boolean, 
    response? : any 
  }> => {
  try {
    const contract = new Client.Client({
      rpcUrl: rpcUrl,
      ...Client.networks.testnet
    })
    
    const { result } = await contract.get_game({
      game_id
    })
    
    if (result.isOk()) {
      return { success: true, response: result.unwrap() };
    }
    
    else return { success: false };
    
  } catch (e) {
    console.log(e);
    return { success: false };
  }
}

const _dbredeemAmount = async (gameId: string, userId: string) => {
  const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_SERVER;
  const ep = "/api/v1/user/redeem";
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

export const redeemAmount = async (game_id : string, userId : string) => {
  const address = (await getAddress()).address;
  const contract = new Client.Client({
    publicKey: address,
    ...Client.networks.testnet,
    rpcUrl
  })
  
  const assembledTx = await contract.redeem({
    user: address,
    game_id
  })
  
  const xdr = assembledTx.toXDR();
  const result = await signTransactionXDR(xdr, address);
  
  if (result.success) {
    const { success: _dbConfirm } = await _dbredeemAmount(game_id, userId);
    if (_dbConfirm)
      return { success: true };
    return { success: false };
  }
  return { success: false };
}

export const getAllowance = async (): Promise<{success : boolean, amount? : bigint}> => {
  try {
    const contract = new USDClient.Client({
      rpcUrl,
      ...USDClient.networks.testnet,
    })
    
    const account = localStorage.getItem("WALLET_ADDRESS");
    
    if (!account) return {success : false};
  
    const { result } = await contract.allowance({
      from: account,
      spender : contractAddress
    })
    
    return { success: true, amount: result };
  } catch (e) {
    return { success: false };
    console.log(e);
  }
}
