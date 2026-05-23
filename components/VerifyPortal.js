"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/contract";

export default function VerifyPortal() {
  const [activeTab, setActiveTab] = useState("single"); // "single" or "bulk"
  
  // Single Audit State
  const [searchHash, setSearchHash] = useState("");
  const [singleResult, setSingleResult] = useState(null);
  
  // Bulk Audit State
  const [inputIds, setInputIds] = useState("");
  const [bulkResults, setBulkResults] = useState(null);

  // Shared State
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  // ---------------------------------------------------------
  // 1. SINGLE HASH VERIFICATION LOGIC
  // ---------------------------------------------------------
  const handleVerifySingle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSingleResult(null);
    setStatus({ state: "loading", message: "Querying distributed ledger network..." });

    try {
      if (!window.ethereum) throw new Error("No crypto wallet found. Install MetaMask.");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

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

      const instName = await contract.issuerNames(rawCredData.issuer);

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

      setSingleResult({
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

  // ---------------------------------------------------------
  // 2. BULK BATCH VERIFICATION LOGIC
  // ---------------------------------------------------------
  const handleVerifyBulk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBulkResults(null);
    setStatus({ state: "loading", message: "Executing batch query on ledger..." });

    const idsArray = inputIds.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    
    if (idsArray.length === 0) {
      setStatus({ state: "error", message: "Invalid format. Use numbers separated by commas (e.g., 1, 4, 12)." });
      setLoading(false);
      return;
    }

    try {
      if (!window.ethereum) throw new Error("No crypto wallet found. Install MetaMask.");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // Call the gasless view function
      const validationResults = await contract.verifyBulk(idsArray);
      
      const formattedResults = idsArray.map((id, index) => ({
        id: id,
        isValid: validationResults[index]
      }));
      
      setBulkResults(formattedResults);
      setStatus({ state: "success", message: `Batch audit complete for ${idsArray.length} records.` });
    } catch (error) {
      console.error(error);
      setStatus({ state: "error", message: "Network error during batch verification." });
    }
    setLoading(false);
  };

  // ---------------------------------------------------------
  // UI RENDERING
  // ---------------------------------------------------------
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Mode Selection Tabs */}
      <div className="flex space-x-2 bg-gray-900/40 p-1.5 rounded-2xl border border-white/5 w-fit mx-auto backdrop-blur-md">
        <button 
          onClick={() => { setActiveTab("single"); setStatus({state: "idle", message: ""}); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === "single" ? "bg-cyan-900/40 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]" : "border border-transparent text-gray-500 hover:text-gray-300"}`}
        >
          Single Hash Audit
        </button>
        <button 
          onClick={() => { setActiveTab("bulk"); setStatus({state: "idle", message: ""}); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === "bulk" ? "bg-blue-900/40 border border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "border border-transparent text-gray-500 hover:text-gray-300"}`}
        >
          Bulk HR Batch
        </button>
      </div>

      <div className="bg-gray-950/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        
        {/* Blue/Cyan Accent Top Neon Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_2px_20px_rgba(59,130,246,0.5)]" />

        <div className="mb-6">
          <h1 className="text-3xl font-black font-mono tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase">
            Verify Engine
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-sans">
            {activeTab === "single" 
              ? "Audit and inspect tamper-proof metadata validity directly using decentralized file index values."
              : "Instantly verify the cryptographic validity of multiple applicant tokens in a single execution."}
          </p>
        </div>

        {/* --- FORM: SINGLE VERIFICATION --- */}
        {activeTab === "single" && (
          <form onSubmit={handleVerifySingle} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">Certificate ID (IPFS Hash Key)</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  required 
                  placeholder="Enter Qm..." 
                  className="flex-1 bg-gray-950/60 border border-white/10 rounded-xl p-3.5 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all" 
                  value={searchHash} 
                  onChange={e => setSearchHash(e.target.value)} 
                />
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono text-xs font-black tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? "Searching..." : "Execute Audit"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* --- FORM: BULK VERIFICATION --- */}
        {activeTab === "bulk" && (
          <form onSubmit={handleVerifyBulk} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">Token IDs (Comma Separated)</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. 1, 4, 15" 
                  className="flex-1 bg-gray-950/60 border border-white/10 rounded-xl p-3.5 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all" 
                  value={inputIds} 
                  onChange={e => setInputIds(e.target.value)} 
                />
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-black tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? "Scanning..." : "Batch Verify"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Telemetry Status Panel */}
        {status.message && (
          <div className={`mt-6 p-4 rounded-xl border font-mono text-xs text-center ${
            status.state === "error" ? "bg-red-950/30 border-red-500/30 text-red-400" : "bg-gray-950/60 border-white/5 text-cyan-400 animate-pulse"
          }`}>
            {status.message}
          </div>
        )}

        {/* --- RESULTS: SINGLE VERIFICATION CARD --- */}
        {activeTab === "single" && singleResult && (
          <div className={`mt-6 p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
            singleResult.revoked ? "bg-red-950/20 border-red-500/30 animate-pulse" : "bg-emerald-950/10 border-emerald-500/30"
          }`}>
            <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest font-bold text-gray-500 uppercase block">CRYPTOGRAPHIC STATUS</span>
                <span className={`text-sm font-mono font-black uppercase ${singleResult.revoked ? "text-red-400" : "text-emerald-400"}`}>
                  {singleResult.revoked ? "⚠️ REVOKED / INVALID" : "✅ VERIFIED AUTHENTIC"}
                </span>
              </div>
              <span className="text-xs font-mono text-gray-600">TOKEN #{singleResult.tokenId}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-gray-500 block text-[10px] tracking-wider uppercase">Student Identity</span>
                <span className="text-white font-bold text-sm">{singleResult.studentName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] tracking-wider uppercase">Degree Program</span>
                <span className="text-white font-bold text-sm">{singleResult.degree}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500 block text-[10px] tracking-wider uppercase">Certified Issuing Authority</span>
                <span className="text-cyan-400 font-bold">{singleResult.issuerName}</span>
                <span className="text-[10px] text-gray-600 block break-all mt-0.5 select-all">{singleResult.issuerAddress}</span>
              </div>
            </div>
          </div>
        )}

        {/* --- RESULTS: BULK VERIFICATION GRID --- */}
        {activeTab === "bulk" && bulkResults && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-4">Batch Audit Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {bulkResults.map((res, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-1 ${res.isValid ? 'bg-emerald-950/10 border-emerald-500/30' : 'bg-red-950/20 border-red-500/30'}`}>
                  <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Token #{res.id}</span>
                  {res.isValid ? (
                    <span className="text-emerald-400 font-black text-xs font-mono tracking-wider uppercase">✅ VALID</span>
                  ) : (
                    <span className="text-red-400 font-black text-xs font-mono tracking-wider uppercase">❌ REVOKED / 404</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}