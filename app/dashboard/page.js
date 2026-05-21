"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../context/WalletContext";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../utils/contract";
import CredentialCard from "../../components/CredentialCard";

export default function HolderDashboard() {
  // Destructured complete wallet management capabilities from context core
  const { account, connectWallet, disconnectWallet } = useWallet();
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load manually dismissed token IDs from local browser storage
  const [hiddenTokens, setHiddenTokens] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hidden_credentials");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

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

  // Push targeted token ID into exclusion list array
  const handleDismissCredential = (tokenId) => {
    const updatedHidden = [...hiddenTokens, tokenId];
    setHiddenTokens(updatedHidden);
    localStorage.setItem("hidden_credentials", JSON.stringify(updatedHidden));
  };

  // Wipe the exclusion list array to restore hidden assets instantly
  const handleResetArchive = () => {
    setHiddenTokens([]);
    localStorage.removeItem("hidden_credentials");
  };

  // Calculate filtered output list (skips items manually dismissed by user)
  const visibleCredentials = credentials.filter(cred => !hiddenTokens.includes(cred.id));

  // State 1: Wallet Disconnected State (Glassmorphism Intercept Interface)
  if (!account) {
    return (
      <div className="w-full max-w-xl mx-auto bg-gray-950/40 border border-white/5 p-12 rounded-3xl backdrop-blur-md text-center shadow-[0_0_50px_rgba(168,85,247,0.1)] relative group">
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

  // State 2: Main Dashboard View
  return (
    <div className="w-full space-y-10">
      
      {/* Header Dashboard Status Node */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-6">
        <div>
          <h1 className="text-4xl font-black font-mono uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            My Credentials
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
            <p className="text-gray-400 text-xs font-mono tracking-wider">
              SECURE ACCESS CORE / <span className="text-cyan-400 select-all">{account}</span>
            </p>
            {/* Interactive Session Disconnect Hook */}
            <button
              onClick={disconnectWallet}
              className="text-[10px] font-mono tracking-widest text-left text-red-500/60 hover:text-red-400 transition uppercase font-bold"
            >
              [ Disconnect Vault ]
            </button>
          </div>
        </div>
        
        {/* Secondary Control Deck Elements */}
        <div className="flex items-center space-x-3">
          {hiddenTokens.length > 0 && (
            <button 
              onClick={handleResetArchive}
              className="text-[10px] font-mono tracking-widest uppercase border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 hover:bg-cyan-500 hover:text-black px-3 py-2 rounded-xl backdrop-blur-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)]"
            >
              Restore Dismissed ({hiddenTokens.length})
            </button>
          )}
          <div className="text-xs font-mono text-gray-500 border border-white/5 bg-gray-950/20 px-4 py-2 rounded-xl backdrop-blur-sm">
            Visible Assets: <span className="text-white font-bold">{visibleCredentials.length}</span>
          </div>
        </div>
      </div>

      {/* Logic Zone: Loading State Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-transparent animate-spin" />
          </div>
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase animate-pulse">Syncing Ledger Vault...</span>
        </div>
      ) : visibleCredentials.length === 0 ? (
        
        // Empty Credentials Vault Template
        <div className="bg-gray-950/20 border border-white/5 rounded-3xl p-16 text-center backdrop-blur-md max-w-2xl mx-auto shadow-xl relative group">
          <div className="absolute inset-0 rounded-3xl border border-dashed border-white/0 group-hover:border-white/10 transition duration-500 pointer-events-none" />
          <span className="text-5xl mb-4 block filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">🎓</span>
          <h3 className="text-lg font-bold font-mono tracking-wide uppercase text-gray-300 mb-2">No Records Registered</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto font-sans leading-relaxed">
            This verified wallet identifier currently contains zero active or unfiltered academic record assertions stamped onto the Sepolia infrastructure.
          </p>
        </div>
      ) : (
        
        // Active Assets Portfolio Grid Layout Frame
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCredentials.map((cred) => (
            <div key={cred.id} className="transition-all duration-300 hover:-translate-y-1 relative group">
              
              {/* Conditional Cross Mark - Displays ONLY if asset is cryptographically revoked */}
              {cred.revoked && (
                <button
                  onClick={() => handleDismissCredential(cred.id)}
                  className="absolute top-4 right-4 z-20 w-6 h-6 rounded-full bg-gray-900/90 border border-red-500/30 flex items-center justify-center text-[10px] font-mono text-red-400 hover:text-red-200 hover:border-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-[0_0_10px_rgba(239,68,68,0.2)] backdrop-blur-sm"
                  title="Dismiss Revoked Card from View"
                >
                  ✕
                </button>
              )}

              {/* Asset Card Core Interface Module */}
              <CredentialCard credential={cred} />

            </div>
          ))}
        </div>
      )}
    </div>
  );
}