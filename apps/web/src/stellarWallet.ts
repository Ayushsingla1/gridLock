import {
  allowAllModules,
  StellarWalletsKit,
  WalletNetwork,
  XBULL_ID,
} from "@creit.tech/stellar-wallets-kit";

const kit = new StellarWalletsKit({
  modules: allowAllModules(),
  network: WalletNetwork.TESTNET,
  selectedWalletId: XBULL_ID,
});

export const signTransaction = kit.signTransaction.bind(kit);

export function getStoredAddress() {
  return localStorage.getItem("WALLET_ADDRESS");
}

export async function getPublicKey() {
  const { address } = await kit.getAddress();
  return address;
}

export async function setWallet(walletId: string) {
  const { address } = await kit.getAddress();
  localStorage.setItem("WALLET_ID", walletId);
  localStorage.setItem("WALLET_ADDRESS", address);
}

export async function disconnect() {
  localStorage.removeItem("WALLET_ID");
  localStorage.removeItem("WALLET_ADDRESS");
  await kit.disconnect();
}

export async function connect(callback: (address: string) => void) {
  await kit.openModal({
    onWalletSelected: async (option) => {
      try {
        await setWallet(option.id);
        const address = await getPublicKey();
        callback(address);
      } catch (e) {
        console.error(e);
      }
    },
  });
}
