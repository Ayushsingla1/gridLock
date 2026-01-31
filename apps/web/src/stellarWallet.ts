import {
  allowAllModules,
  FREIGHTER_ID,
  StellarWalletsKit,
  WalletNetwork,
} from "@creit.tech/stellar-wallets-kit";

const NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
const SELECTED_WALLET_ID = NETWORK_PASSPHRASE;

function getSelectedWalletId() {
  return localStorage.getItem('selectedWalletId');
}

const kit = new StellarWalletsKit({
  modules: allowAllModules(),
  network: WalletNetwork.TESTNET,
  // StellarWalletsKit forces you to specify a wallet, even if the user didn't
  // select one yet, so we default to Freighter.
  // We'll work around this later in `getPublicKey`.
  selectedWalletId: getSelectedWalletId() ?? FREIGHTER_ID,
});

export const signTransaction = kit.signTransaction.bind(kit);

export async function getPublicKey() {
  if (!getSelectedWalletId()) return null;
  const { address } = await kit.getAddress();
  return address;
}

export async function setWallet(walletId: string) {
  localStorage.setItem(SELECTED_WALLET_ID, walletId);
  kit.setWallet(walletId);
}

export async function disconnect(callback?: () => Promise<void>) {
  localStorage.removeItem(SELECTED_WALLET_ID);
  kit.disconnect();
  if (callback) await callback();
}

export async function connect(callback?: (id: string) => void) {
  await kit.openModal({
    onWalletSelected: async (option) => {
      try {
        await setWallet(option.id);
        if (callback) callback(option.id);
      } catch (e) {
        console.error(e);
      }
      console.log(option)
      return option.id;
    },
  });
}
