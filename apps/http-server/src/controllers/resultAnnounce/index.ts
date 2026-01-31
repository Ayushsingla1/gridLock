import { MatchSchema } from "@repo/types";
import { Keypair } from "@stellar/stellar-sdk";
import { Client, basicNodeSigner } from "@stellar/stellar-sdk/contract";

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
  } catch (e) {
    console.log(e);
    return { success: false, msg: "try again later" };
  }
};

export const createGame = async (gameId: string, updatedMatch: MatchSchema) => {
  try {
    if (!updatedMatch || !(updatedMatch.status == "Scheduled"))
      return {
        status: 404,
        success: false,
        msg: "match not found or not scheduled",
      };

    const client = await initialize();
    console.log(client);
    //@ts-ignore
    const createGameTx = await client.create_game({
      owner: wallet.publicKey(),
      game_id: gameId,
    });
    const { result } = await createGameTx.signAndSend();
    console.log(result);
    if (result) {
      return {
        status: 200,
        success: true,
        msg: "Game created Successfully",
        id: updatedMatch.id,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      success: false,
      msg: "error while creating game, try again",
    };
  }
};
