import { connect, getStoredAddress } from "@/stellarWallet";
import { useEffect, useState } from "react";

export default function WalletConnectButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // On mount: just read localStorage
  useEffect(() => {
    const stored = getStoredAddress();
    if (stored) {
      setAddress(stored);
    }
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      await connect((addr) => {
        setAddress(addr);
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={connectWallet}
      disabled={loading || !!address}
      className="
        bg-neutral-900 
        border border-neutral-800 
        text-white 
        px-4 py-2 
        rounded-xl 
        text-sm 
        hover:bg-neutral-800 
        transition
        flex items-center gap-2
        disabled:opacity-50
      "
    >
      {loading
        ? "Connecting..."
        : address
        ? `${address.slice(0, 5)}...${address.slice(-5)}`
        : "Connect Wallet"}
    </button>
  );
}
