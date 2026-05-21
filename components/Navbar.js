"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";

export default function Navbar() {
  const { account, connectWallet } = useWallet();

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-8 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-mono tracking-wider">
        🔗 CREDCHAIN
      </Link>
      
      <div className="flex items-center space-x-6">
        <Link href="/dashboard" className="text-gray-300 hover:text-white font-medium transition">Dashboard</Link>
        <Link href="/issue" className="text-gray-300 hover:text-white font-medium transition">Issue Portal</Link>
        
        {account ? (
          <div className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg text-sm text-emerald-400 font-mono">
            {account.substring(0, 6)}...{account.substring(account.length - 4)}
          </div>
        ) : (
          <button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700 font-bold px-4 py-2 rounded-lg text-sm transition">
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}