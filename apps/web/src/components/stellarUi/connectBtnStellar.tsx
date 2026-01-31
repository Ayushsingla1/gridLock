import { connect, getPublicKey, setWallet } from "@/stellarWallet";
import { useEffect, useState } from "react";

export default function WalletConnectButton() {
  const [localAddr, setLocalAddr] = useState<string>("");


  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string>("");
  
  const connectWalletCallBack = (id: string) => {
    if(id) {
      setConnected(true);
    }
    return;
  } 

  const connectWallet = async () => {
    setLoading(true);
    await connect(connectWalletCallBack);
    getPublicKey().then(addr => {
      if(addr){
        setWallet(addr);
        setAddress(addr);
      }
    });
    setLoading(false);
  } 

  useEffect(() => {
    getPublicKey().then(addr => {
      if(addr) {
        setAddress(addr);
      }
    }); 
  }, [])

  return (
    <button
      onClick={connectWallet}
      disabled={loading || connected}
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
      "
    >
      {loading ? "Connecting..." : connected  && address ? `${address.slice(0, 5)}...${address.slice(-5)}` : "Connect Wallet"}
    </button>
  );
}

