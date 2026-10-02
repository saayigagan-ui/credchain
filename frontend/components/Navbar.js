"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/contract";

export default function Navbar() {
  const { account, connectWallet } = useWallet();
  
  // Two distinct access roles
  const [isAdmin, setIsAdmin] = useState(false);
  const [isIssuer, setIsIssuer] = useState(false);

  useEffect(() => {
    const checkAccessLevels = async () => {
      // If no wallet is connected, they get zero special privileges
      if (!account || !window.ethereum) {
        setIsAdmin(false);
        setIsIssuer(false);
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        
        // 1. Check if they are the Super Admin (Contract Owner)
        const contractOwner = await contract.owner();
        const isOwner = account.toLowerCase() === contractOwner.toLowerCase();
        setIsAdmin(isOwner);

        // 2. Check if they are an Approved Issuer
        // IMPORTANT: Change "approvedIssuers" if your solidity mapping has a different name!
        let issuerStatus = false;
        try {
          issuerStatus = await contract.approvedIssuers(account);
        } catch (err) {
          console.warn("Could not check issuer mapping. Verify the mapping name in your ABI.", err);
        }
        
        // The Super Admin should also be allowed to issue credentials, so we grant them issuer rights too
        if (isOwner || issuerStatus) {
          setIsIssuer(true);
        } else {
          setIsIssuer(false);
        }
        
      } catch (error) {
        console.error("Failed to verify access levels:", error);
        setIsAdmin(false);
        setIsIssuer(false);
      }
    };

    checkAccessLevels();
  }, [account]);

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-8 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-mono tracking-wider">
        🔗 CREDCHAIN
      </Link>
      
      <div className="flex items-center space-x-6">
        <Link href="/dashboard" className="text-gray-300 hover:text-white font-medium transition">Dashboard</Link>
        
        {/* CONDITIONAL ISSUER LINK: Only shows for Approved Issuers and the Super Admin */}
        {isIssuer && (
          <Link href="/issue" className="text-gray-300 hover:text-white font-medium transition">Issue Portal</Link>
        )}
        
        {/* CONDITIONAL ADMIN LINK: Only renders if the connected wallet is the Super Admin */}
        {isAdmin && (
          <Link href="/admin" className="text-emerald-400 hover:text-emerald-300 font-bold border-b-2 border-emerald-400 transition pb-1">
            Admin Portal
          </Link>
        )}
        
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