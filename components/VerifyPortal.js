"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/contract";

export default function VerifyPortal() {
  const [searchHash, setSearchHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setStatus({ state: "loading", message: "Querying distributed ledger network..." });

    try {
      if (!window.ethereum) throw new Error("No crypto wallet found. Install MetaMask.");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // Check blockchain for token matching the provided IPFS Hash identifier
      const totalTokens = await contract.totalCredentials();
      let foundTokenId = null;
      let rawCredData = null;

      for (let i = 1; i <= totalTokens; i++) {
        const cred = await contract.getCredential(i);
        if (cred.ipfsHash === searchHash.trim()) {
          foundTokenId = i;
          rawCredData = cred;
          break;
        }
      }

      if (!foundTokenId) {
        setStatus({ state: "error", message: "Verification Failed: This certificate hash does not exist on the blockchain ledger." });
        setLoading(false);
        return;
      }

      // Fetch institutional string data
      const instName = await contract.issuerNames(rawCredData.issuer);

      // Fetch dynamic JSON properties straight from Pinata gateway pipelines
      let studentName = "Verified Student";
      try {
        const res = await fetch(`https://gateway.pinata.cloud/ipfs/${rawCredData.ipfsHash}`);
        if (res.ok) {
          const ipfsJson = await res.json();
          studentName = ipfsJson.studentName || studentName;
        }
      } catch (err) {
        console.warn("Could not reach IPFS pinning metrics:", err);
      }

      setResult({
        tokenId: foundTokenId.toString(),
        degree: rawCredData.credentialType,
        issuerName: instName || "Authorized Issuer",
        issuerAddress: rawCredData.issuer,
        studentName: studentName,
        revoked: rawCredData.revoked
      });

      setStatus({ state: "success", message: "Cryptographic Lookup Match Complete." });
    } catch (error) {
      console.error(error);
      setStatus({ state: "error", message: error.message || "An error occurred during verification query." });
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-950/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        
        {/* Blue/Cyan Accent Top Neon Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_2px_20px_rgba(59,130,246,0.5)]" />

        <div className="mb-6">
          <h1 className="text-3xl font-black font-mono tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase">
            Verify Engine
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-sans">Audit and inspect tamper-proof metadata validity directly using decentralized file index values.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">Certificate ID (IPFS Hash Key)</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                required 
                placeholder="Enter Qm..." 
                className="flex-1 bg-gray-950/60 border border-white/10 rounded-xl p-3.5 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all" 
                value={searchHash} 
                onChange={e => setSearchHash(e.target.value)} 
              />
              <button 
                type="submit" 
                disabled={loading} 
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono text-xs font-black tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Searching..." : "Audit"}
              </button>
            </div>
          </div>
        </form>

        {/* Telemetry Status Panel */}
        {status.message && !result && (
          <div className={`mt-6 p-4 rounded-xl border font-mono text-xs text-center ${
            status.state === "error" ? "bg-red-950/30 border-red-500/30 text-red-400" : "bg-gray-950/60 border-white/5 text-cyan-400 animate-pulse"
          }`}>
            {status.message}
          </div>
        )}

        {/* Audit Results View Card */}
        {result && (
          <div className={`mt-6 p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
            result.revoked ? "bg-red-950/20 border-red-500/30 animate-pulse" : "bg-emerald-950/10 border-emerald-500/30"
          }`}>
            <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest font-bold text-gray-500 uppercase block">CRYPTOGRAPHIC STATUS</span>
                <span className={`text-sm font-mono font-black uppercase ${result.revoked ? "text-red-400" : "text-emerald-400"}`}>
                  {result.revoked ? "⚠️ REVOKED / INVALID" : "✅ VERIFIED AUTHENTIC"}
                </span>
              </div>
              <span className="text-xs font-mono text-gray-600">TOKEN #{result.tokenId}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-gray-500 block text-[10px] tracking-wider uppercase">Student Identity</span>
                <span className="text-white font-bold text-sm">{result.studentName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] tracking-wider uppercase">Degree Program</span>
                <span className="text-white font-bold text-sm">{result.degree}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500 block text-[10px] tracking-wider uppercase">Certified Issuing Authority</span>
                <span className="text-cyan-400 font-bold">{result.issuerName}</span>
                <span className="text-[10px] text-gray-600 block break-all mt-0.5 select-all">{result.issuerAddress}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}