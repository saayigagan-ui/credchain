"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../utils/contract";
import { uploadMetadataToIPFS } from "../../utils/ipfs";

export default function IssuePortal({ initialTab = "issue" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [formData, setFormData] = useState({ 
    recipient: "", 
    studentName: "", 
    credentialType: "B.Tech in Computer Science",
    email: "" 
  });
  const [revokeId, setRevokeId] = useState("");
  
  // New Admin State
  const [adminData, setAdminData] = useState({ walletAddress: "", institutionName: "" });

  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [txHash, setTxHash] = useState("");

  // Keep active tab perfectly synchronized with the master top navigation menu clicks
  useEffect(() => {
    setActiveTab(initialTab);
    setStatus({ state: "idle", message: "" });
    setTxHash("");
  }, [initialTab]);

  const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask is required.");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "Processing blockchain transaction..." });
    setTxHash("");
    try {
      const contract = await getContract();
      const metadata = { studentName: formData.studentName, degree: formData.credentialType, recipient: formData.recipient, issueDate: new Date().toISOString() };
      const ipfsHash = await uploadMetadataToIPFS(metadata);
      const credentialHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(metadata)));
      
      const tx = await contract.issueCredential(formData.recipient, ipfsHash, formData.credentialType, credentialHash);
      const receipt = await tx.wait();
      
      let currentIssuerName = "Authorized Institution";
      try {
        const signerAddress = await tx.from;
        currentIssuerName = await contract.issuerNames(signerAddress) || "Authorized Institution";
      } catch (nameErr) {
        console.error("Failed to fetch issuer name for email payload:", nameErr);
      }

      setStatus({ state: "success", message: "Credential minted successfully!" });
      setTxHash(receipt.hash);

      if (formData.email) {
        setStatus({ state: "success", message: "Credential minted! Launching secure email transmission..." });
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'issue',
              email: formData.email,
              studentName: formData.studentName,
              degree: formData.credentialType,
              ipfsHash: ipfsHash,
              issuerName: currentIssuerName
            })
          });
          setStatus({ state: "success", message: "Credential minted securely and notification email dispatched!" });
        } catch (emailError) {
          console.error("Background email dispatch failed:", emailError);
        }
      }
      
      setFormData({ recipient: "", studentName: "", credentialType: "B.Tech in Computer Science", email: "" });
    } catch (error) {
      setStatus({ state: "error", message: error.reason || error.message || "Failed." });
    }
  };

  const handleRevoke = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "Scanning distributed ledger keys..." });
    setTxHash("");
    try {
      const contract = await getContract();
      const totalTokens = await contract.totalCredentials();
      let targetTokenId = null;
      let targetCredData = null;

      for (let i = 1; i <= totalTokens; i++) {
        const cred = await contract.getCredential(i);
        if (cred.ipfsHash === revokeId) { 
          targetTokenId = i; 
          targetCredData = cred;
          break; 
        }
      }

      if (!targetTokenId) throw new Error("Credential not found.");
      
      const tx = await contract.revokeCredential(targetTokenId);
      const receipt = await tx.wait();
      
      let currentIssuerName = "Authorized Institution";
      try {
        const signerAddress = await tx.from;
        currentIssuerName = await contract.issuerNames(signerAddress) || "Authorized Institution";
      } catch (nameErr) {
        console.error("Failed to fetch issuer name for email payload:", nameErr);
      }

      setStatus({ state: "success", message: "Revoked successfully." });
      setTxHash(receipt.hash);

      if (formData.email) {
        setStatus({ state: "success", message: "Revoked successfully. Emitting network security warnings..." });
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'revoke',
              email: formData.email,
              degree: targetCredData ? targetCredData.credentialType : "Blockchain Certificate",
              ipfsHash: revokeId,
              issuerName: currentIssuerName
            })
          });
          setStatus({ state: "success", message: "Revoked successfully and notification sent." });
        } catch (emailError) {
          console.error("Background revocation notice failed:", emailError);
        }
      }

      setRevokeId("");
    } catch (error) {
      setStatus({ state: "error", message: error.reason || error.message || "Failed." });
    }
  };

  const handleRegisterInstitution = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "Broadcasting authority registration on-chain..." });
    setTxHash("");
    try {
      const contract = await getContract();
      const tx = await contract.approveIssuer(adminData.walletAddress, adminData.institutionName);
      const receipt = await tx.wait();
      
      setStatus({ state: "success", message: `Institution '${adminData.institutionName}' registered successfully!` });
      setTxHash(receipt.hash);
      setAdminData({ walletAddress: "", institutionName: "" });
    }  catch (error) {
      console.error("THE REAL ERROR IS:", error);
      alert("THE REAL ERROR: " + (error.reason || error.message)); 
      setStatus({ state: "error", message: error.reason || "Failed. Are you the contract owner?" });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-950/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group">
        
        {/* Dynamic Inner Top Accent Glow Ring matching chosen operations */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r transition-all duration-500 ${
          activeTab === "issue" ? "from-emerald-500 to-teal-400 shadow-[0_2px_20px_rgba(16,185,129,0.5)]" :
          activeTab === "revoke" ? "from-red-500 to-rose-400 shadow-[0_2px_20px_rgba(239,68,68,0.5)]" :
          "from-blue-500 to-indigo-400 shadow-[0_2px_20px_rgba(59,130,246,0.5)]"
        }`} />

        {/* VIEW ARCHITECTURE 1: Issuance Sub-Portal Section */}
        {activeTab === "issue" && (
          <form onSubmit={handleIssue} className="space-y-6">
            <div>
              <h1 className="text-3xl font-black font-mono tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 uppercase">
                Issue Identity
              </h1>
              <p className="text-gray-400 text-xs mt-1 font-sans">Deploy verifiable academic token assertions to the decentralized ledger network.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">Recipient Public Wallet</label>
                <input type="text" required placeholder="0x..." className="w-full bg-gray-950/60 border border-white/10 rounded-xl p-3.5 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all" value={formData.recipient} onChange={e => setFormData({ ...formData, recipient: e.target.value })} />
              </div>
              
              <div>
                <label className="block text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">Student Full Name</label>
                <input type="text" required placeholder="e.g., Jane Doe" className="w-full bg-gray-950/60 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all" value={formData.studentName} onChange={e => setFormData({ ...formData, studentName: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">Degree / Course Category</label>
                <input type="text" required className="w-full bg-gray-950/60 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all" value={formData.credentialType} onChange={e => setFormData({ ...formData, credentialType: e.target.value })} />
              </div>
              
              <div>
                <label className="block text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">Notification Email Destination</label>
                <input type="email" required placeholder="student@example.com" className="w-full bg-gray-950/60 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <button type="submit" disabled={status.state === "loading"} className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none">
              {status.state === "loading" ? "Executing Transaction..." : "Authorize On-Chain Mint"}
            </button>
          </form>
        )}

        {/* VIEW ARCHITECTURE 2: Revocation Core Segment */}
        {activeTab === "revoke" && (
          <form onSubmit={handleRevoke} className="space-y-6">
            <div>
              <h1 className="text-3xl font-black font-mono tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400 uppercase">
                Revoke Assertion
              </h1>
              <p className="text-gray-400 text-xs mt-1 font-sans">Permanently invalidate a targeted identifier on-chain to flag non-compliance records.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">Certificate Token ID (IPFS Hash Lookup)</label>
                <input type="text" required placeholder="Qm..." className="w-full bg-gray-950/60 border border-white/10 rounded-xl p-3.5 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-all" value={revokeId} onChange={e => setRevokeId(e.target.value)} />
              </div>
              
              <div>
                <label className="block text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">Recipient Security Update Email (Optional)</label>
                <input type="email" placeholder="student@example.com" className="w-full bg-gray-950/60 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-all" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <button type="submit" disabled={status.state === "loading"} className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none">
              {status.state === "loading" ? "Broadcasting Revocation..." : "Execute Invalidation Vector"}
            </button>
          </form>
        )}

        {/* VIEW ARCHITECTURE 3: Administrative Control Hub */}
        {activeTab === "admin" && (
          <form onSubmit={handleRegisterInstitution} className="space-y-6">
            <div>
              <h1 className="text-3xl font-black font-mono tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase">
                Register Authority
              </h1>
              <p className="text-gray-400 text-xs mt-1 font-sans">Map a verified institutional name identity to an issuing cryptographic wallet address.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">Issuer Target Wallet Address</label>
                <input type="text" required placeholder="0x..." className="w-full bg-gray-950/60 border border-white/10 rounded-xl p-3.5 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all" value={adminData.walletAddress} onChange={e => setAdminData({ ...adminData, walletAddress: e.target.value })} />
              </div>
              
              <div>
                <label className="block text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">Official Institution String Label</label>
                <input type="text" required placeholder="e.g., Stanford University" className="w-full bg-gray-950/60 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all" value={adminData.institutionName} onChange={e => setAdminData({ ...adminData, institutionName: e.target.value })} />
              </div>
            </div>

            <button type="submit" disabled={status.state === "loading"} className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none">
              {status.state === "loading" ? "Committing Entry..." : "Authorize Institution Endpoint"}
            </button>
          </form>
        )}

        {/* Unified Operations Real-Time Telemetry Screen */}
        {status.message && (
          <div className={`mt-6 p-4 rounded-xl border font-mono text-xs text-center transition-all duration-300 ${
            status.state === "error" ? "bg-red-950/30 border-red-500/30 text-red-400" :
            status.state === "success" ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400" :
            "bg-gray-950/60 border-white/5 text-cyan-400 animate-pulse"
          }`}>
            <span className="font-bold uppercase tracking-wider block mb-1">
              {status.state === "loading" ? "⚡ System Telemetry" : "📊 Status Report"}
            </span>
            {status.message}
            {txHash && (
              <div className="mt-2 text-[10px] text-gray-500 break-all select-all">
                TX: {txHash}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}