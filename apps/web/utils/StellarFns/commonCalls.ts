import * as StellarSdk from "@stellar/stellar-sdk";
import { gridlockContractAddress } from "../../constants/constants";

export const RPC_URL = "https://soroban-testnet.stellar.org";
export const NETWORK = StellarSdk.Networks.TESTNET;
export const CONTRACT_ID = gridlockContractAddress;

const server = new StellarSdk.rpc.Server(RPC_URL);

/**
 * READ-ONLY (no signing)
 */
export async function viewCall(
  functionName: string,
  args: StellarSdk.xdr.ScVal[]
) {
  const dummy = new StellarSdk.Account(
    StellarSdk.Keypair.random().publicKey(),
    "0"
  );

  const tx = new StellarSdk.TransactionBuilder(dummy, {
    fee: "100",
    networkPassphrase: NETWORK,
  })
    .addOperation(
      StellarSdk.Operation.invokeContractFunction({
        contract: CONTRACT_ID,
        function: functionName,
        args,
      })
    )
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);

  if ("result" in sim) {
    return sim.result?.retval;
  } else {
    throw new Error("Simulation failed");
  }
}

/**
 * WRITE (wallet signs)
 */
export async function writeCall(
  publicKey: string,
  signTransaction: (xdr: string) => Promise<{signedTxXdr: string, signerAddress?: string}>,
  functionName: string,
  args: StellarSdk.xdr.ScVal[],
  contractAdd?: string
) {
  const source = await server.getAccount(publicKey);

  const tx = new StellarSdk.TransactionBuilder(source, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK,
  })
    .addOperation(
      StellarSdk.Operation.invokeContractFunction({
        contract: contractAdd ?? CONTRACT_ID,
        function: functionName,
        args,
      })
    )
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(tx);
  const signedXdr = await signTransaction(prepared.toXDR());

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr.signedTxXdr,
    NETWORK
  );

  const res = await server.sendTransaction(signedTx);

  // poll
  let status: string = res.status;
  while (status === "PENDING") {
    await new Promise((r) => setTimeout(r, 1000));
    const txRes = await server.getTransaction(res.hash);
    status = txRes.status;
    if (status === "SUCCESS") return txRes.txHash;
    if (status === "FAILED") throw new Error("Transaction failed");
  }
}
