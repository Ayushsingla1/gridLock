import { Keypair } from "@stellar/stellar-sdk";
import { basicNodeSigner } from "@stellar/stellar-sdk/minimal/contract";
import { Client } from "@stellar/stellar-sdk/no-eventsource/contract";

const rpcUrl = "https://soroban-testnet.stellar.org";
const privateKey = process.env.PRIVATE_KEY!;
const wallet = Keypair.fromSecret(privateKey);
const networkPassphrase = "Test SDF Network ; September 2015";

const initialize = async () => {
  const { signTransaction } = basicNodeSigner(wallet, networkPassphrase);
  const client = await Client.from({
    contractId: "CDOI6BF4UT2DGZIDTQBLBLHL7Y6NVFO7JPPCYIW7ENO2JX7YLUROB2EP",
    networkPassphrase,
    rpcUrl,
    publicKey: wallet.publicKey(),
    signTransaction,
  });
  return client;
};

export const announceResult = async (gameId: string, winner: number) => {
  try {
    const client = await initialize();
    //@ts-ignore
    const announceResultTx = await client.result_announced({
      owner: wallet.publicKey(),
      game_id: gameId,
      result: winner,
    });
    const { result } = await announceResultTx.signAndSend();
    console.log(result);
    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false, msg: "try again later" };
  }
};
