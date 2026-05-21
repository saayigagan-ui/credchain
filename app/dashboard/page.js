"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../context/WalletContext";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../utils/contract";
import CredentialCard from "../../components/CredentialCard";

export default function HolderDashboard() {
  const { account, connectWallet } = useWallet();
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      fetchMyCredentials();
    }
  }, [account]);

  const fetchMyCredentials = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const tokenIds = await contract.getHolderCredentials(account);
      const fetchedCreds = [];

      for (let i = 0; i < tokenIds.length; i++) {
        try {
          const tokenId = tokenIds[i];
          const credData = await contract.getCredential(tokenId);
          
          const instName = await contract.issuerNames(credData.issuer);

          let studentName = "Verified Student";
          try {
            const res = await fetch(`https://gateway.pinata.cloud/ipfs/${credData.ipfsHash}`);
            if (res.ok) {
              const ipfsJson = await res.json();
              studentName = ipfsJson.studentName || studentName;
            }
          } catch (ipfsErr) {
            console.warn("Could not fetch IPFS JSON", ipfsErr);
          }

          fetchedCreds.push({
            id: tokenId.toString(),
            ipfsHash: credData.ipfsHash,
            studentName: studentName,
            degree: credData.credentialType,
            issuerAddress: credData.issuer,
            issuerName: instName || "Authorized Institution",
            revoked: credData.revoked
          });
        } catch (innerErr) {
          console.error("Error fetching individual token data:", innerErr);
        }
      }

      setCredentials(fetchedCreds);
    } catch (error) {
      console.error("Error fetching credentials:", error);
    }
    setLoading(false);
  };

  // State 1: Wallet Disconnected State (Glassmorphism Intercept Interface)
  if (!account) {
    return (
      <div className="w-full max-w-xl mx-auto bg-gray-950/40 border border-white/5 p-12 rounded-3xl backdrop-blur-md text-center shadow-[0_0_50px_rgba(168,85,247,0.1)] relative group">
        {/* Decorative Internal Border Pulsing Ring */}
        <div className="absolute inset-0 rounded-3xl border border-purple-500/0 group-hover:border-purple-500/20 transition duration-700 pointer-events-none" />
        
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-4xl mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          🔒
        </div>
        
        <h1 className="text-3xl font-black font-mono tracking-wide uppercase text-white mb-3">
          Vault Authentication
        </h1>
        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-8 font-sans leading-relaxed">
          Establish a secure handshake with your crypto wallet to verify signed web3 achievements on-chain.
        </p>
        
        <button 
          onClick={connectWallet}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-black tracking-widest uppercase rounded-xl transition duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95"
        >
          Connect MetaMask Securely
        </button>
      </div>
    );
  }

  // State 2: Main Dashboard View (Inherits theme from background wrapper canvas)
  return (
    <div className="w-full space-y-10">
      
      {/* Header Dashboard Status Node */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-6">
        <div>
          <h1 className="text-4xl font-black font-mono uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            My Credentials
          </h1>
          <p className="text-gray-400 text-xs font-mono mt-2 tracking-wider">
            SECURE ACCESS CORE / <span className="text-cyan-400 select-all">{account}</span>
          </p>
        </div>
        
        {/* Secondary Clean Functional Node */}
        <div className="text-xs font-mono text-gray-500 border border-white/5 bg-gray-950/20 px-4 py-2 rounded-xl backdrop-blur-sm">
          Tokens Located: <span className="text-white font-bold">{credentials.length}</span>
        </div>
      </div>

      {/* Logic Zone: Loading State Spinner (Morph Design Template) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-transparent animate-spin" />
          </div>
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase animate-pulse">Syncing Ledger Vault...</span>
        </div>
      ) : credentials.length === 0 ? (
        
        // Empty Credentials Vault Template
        <div className="bg-gray-950/20 border border-white/5 rounded-3xl p-16 text-center backdrop-blur-md max-w-2xl mx-auto shadow-xl relative group">
          <div className="absolute inset-0 rounded-3xl border border-dashed border-white/0 group-hover:border-white/10 transition duration-500 pointer-events-none" />
          <span className="text-5xl mb-4 block filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">🎓</span>
          <h3 className="text-lg font-bold font-mono tracking-wide uppercase text-gray-300 mb-2">No Records Registered</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto font-sans leading-relaxed">
            This verified wallet identifier currently contains zero active academic record assertions stamped onto the Sepolia testnet infrastructure.
          </p>
        </div>
      ) : (
        
        // Active Assets Portfolio Grid Layout Frame
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((cred, index) => (
            <div key={index} className="transition-all duration-300 hover:-translate-y-1">
              <CredentialCard credential={cred} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}