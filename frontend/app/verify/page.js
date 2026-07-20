"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../utils/contract";

function VerifySearch() {
  const searchParams = useSearchParams();
  const [certificateId, setCertificateId] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [data, setData] = useState(null);

  useEffect(() => {
    const queryId = searchParams.get("id");
    if (queryId) {
      setCertificateId(queryId);
      executeVerification(queryId);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    executeVerification(certificateId);
  };

  const executeVerification = async (idToVerify) => {
    if (!idToVerify) return;
    setStatus("loading");
    setData(null);

    try {
      console.log("Step 1: Fetching IPFS Data for ID:", idToVerify);
      const res = await fetch(`https://gateway.pinata.cloud/ipfs/${idToVerify}`);
      if (!res.ok) throw new Error("Could not find data on IPFS.");
      const meta = await res.json();
      console.log("IPFS Data Found:", meta);
      
      console.log("Step 2: Connecting to Sepolia Blockchain...");
      // This public node usually has much better CORS policies for browsers
const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      console.log("Step 3: Fetching total credentials...");
      const totalBigInt = await contract.totalCredentials();
      const total = Number(totalBigInt);
      console.log("Total credentials on contract:", total);
      
      let isRevoked = false;
      let foundOnChain = false;

      console.log("Step 4: Scanning chain for matching ID...");
      let issuerAddress = "";
      let issuerName = "";

      for (let i = 1; i <= total; i++) {
        try {
          const cred = await contract.getCredential(i);
          if (cred.ipfsHash === idToVerify) {
            console.log(`Match found at Token ID: ${i}`);
            foundOnChain = true;
            isRevoked = cred.revoked;
            
            // --> NEW: Grab the issuer details while we have the match
            issuerAddress = cred.issuer;
            issuerName = await contract.issuerNames(cred.issuer);
            break; 
          }
        } catch (innerErr) {
          console.warn(`Skipping token ${i} due to read error:`, innerErr);
        }
      }

      if (!foundOnChain) throw new Error("Not found in the smart contract registry.");

      // --> NEW: Attach the name and address to the final data state
      setData({ ...meta, revoked: isRevoked, issuerName: issuerName, issuerAddress: issuerAddress });
      setStatus(isRevoked ? "revoked" : "verified");
      console.log("Verification Complete!");
      
    } catch (error) {
      console.error("Verification Pipeline Error:", error);
      setStatus("failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-2xl w-full bg-gray-800 border border-gray-700 rounded-3xl p-10 shadow-2xl z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Verify a Credential
          </h1>
          <p className="text-gray-400 text-lg">Enter the Unique Certificate ID to cryptographically audit its validity.</p>
        </div>

        {/* The Search Bar Form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="e.g., QmXoypizjW3WknFiJnKL..."
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-600 rounded-xl p-4 text-white font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
            required
          />
          <button 
            type="submit"
            disabled={status === "loading"}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition shadow-lg disabled:opacity-50"
          >
            {status === "loading" ? "Scanning..." : "Verify"}
          </button>
        </form>

        {/* Results Area */}
        <div className="min-h-[150px]">
          {status === "idle" && (
            <div className="h-full flex items-center justify-center text-gray-500 italic">
              Awaiting input...
            </div>
          )}

          {status === "failed" && (
            <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl text-center animate-fadeIn">
              <span className="text-4xl mb-2 block">❌</span>
              <h3 className="text-red-400 font-bold text-lg">Verification Failed</h3>
              <p className="text-red-300/70 text-sm mt-1">Check the developer console for the exact error.</p>
            </div>
          )}

          {status === "revoked" && data && (
            <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl animate-fadeIn">
              <div className="flex items-center justify-center space-x-2 mb-6 border-b border-red-500/20 pb-4">
                <span className="text-red-500 font-black text-xl">⚠️ CREDENTIAL REVOKED</span>
              </div>
              <p className="text-gray-400 text-sm text-center mb-4">
                This credential was permanently voided by the issuing institution. It is no longer valid.
              </p>
            </div>
          )}

          {status === "verified" && data && (
            <div className="bg-emerald-900/20 border border-emerald-500/50 p-6 rounded-xl animate-fadeIn">
              <div className="flex items-center justify-center space-x-2 mb-6 border-b border-emerald-500/20 pb-4">
                <span className="text-emerald-400 font-black text-xl">✓ VERIFIED AUTHENTIC</span>
              </div>
              
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-500">RECIPIENT NAME</span>
                  <span className="text-white font-bold">{data.studentName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-500">DEGREE / CREDENTIAL</span>
                  <span className="text-blue-300 font-bold">{data.degree}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-500">WALLET ADDRESS</span>
                  <span className="text-gray-400 text-xs truncate max-w-[150px] sm:max-w-xs">{data.recipient}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading portal...</div>}>
      <VerifySearch />
    </Suspense>
  );
}