//import { signTransaction } from "@/stellarWallet";
//import {
//  isConnected,
//} from "@stellar/freighter-api";
import { gridlockContractAddress, rpcUrl } from "../constants/constants";
import * as StellarSdk from "@stellar/stellar-sdk";

//export const getUserBet = () => {
//  const resut = 
//}


export async function invokeViewContract({
  publicKey,
  signTransaction,
  functionName,
  args = [],
}: {
  publicKey: string;
  signTransaction: (xdr: string) => Promise<{
        signedTxXdr: string;
        signerAddress?: string;
    }>;
  functionName: string;
  args?: StellarSdk.xdr.ScVal[];
}) {
  const server = new StellarSdk.rpc.Server(rpcUrl);

  // 1. Load user account
  const sourceAccount = await server.getAccount(publicKey);

  // 2. Build transaction
  const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.invokeContractFunction({
        contract: gridlockContractAddress,
        function: functionName,
        args,
      })
    )
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if ("result" in sim) {
    const scVal = sim.result?.retval;
    console.log(scVal);
  } else {
    console.error("Simulation failed:", sim);
    throw new Error("Simulation failed");
  }
  // return decodeGetBetResult(sim.result.retval);

  return {};
}

