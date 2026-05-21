"use client";

import { useWallet } from "../context/WalletContext";

export default function ConnectWallet() {
  const { account, connectWallet } = useWallet();

  return (
    <div>
      {account ? (
        <div className="bg-gray-900 border border-gray-700 text-emerald-400 font-mono px-4 py-2 rounded-xl text-sm shadow-inner transition">
          {account.substring(0, 6)}...{account.substring(account.length - 4)}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 transform active:scale-95 shadow-md"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}