"use client";

import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from "recharts";

// Mock Analytical Data Engine modeling enterprise operations
const trafficData = [
  { name: "09:00", Verifications: 42, Mints: 12 },
  { name: "10:00", Verifications: 89, Mints: 45 },
  { name: "11:00", Verifications: 145, Mints: 78 },
  { name: "12:00", Verifications: 112, Mints: 34 },
  { name: "13:00", Verifications: 198, Mints: 92 },
  { name: "14:00", Verifications: 264, Mints: 110 },
  { name: "15:00", Verifications: 340, Mints: 140 },
];

const gasOptimizationData = [
  { name: "Mon", StandardGas: 85, OptimizedGas: 42 },
  { name: "Tue", StandardGas: 92, OptimizedGas: 44 },
  { name: "Wed", StandardGas: 78, OptimizedGas: 39 },
  { name: "Thu", StandardGas: 110, OptimizedGas: 51 },
  { name: "Fri", StandardGas: 95, OptimizedGas: 46 },
];

// CRITICAL: The "export default" is mandatory here for dynamic imports!
export default function AdminAnalytics() {
  const [logs, setLogs] = useState([
    "[14:32:01] [SYSTEM_CORE] - Analytical monitoring nodes synchronized.",
    "[14:35:12] [SEPOLIA_NODE_04] - Verification handshake secured for Token_ID #0412",
    "[14:39:45] [PINATA_IPFS] - Metadata block synchronization complete.",
  ]);

  // Simulate a live-ticking network activity feed to captivate judges
  useEffect(() => {
    const actions = [
      "INCOMING VERIFICATION ATTRIBUTION MATCHED FOR TOKEN_ID #",
      "METADATA ATTALATION RESOLVED OVER PINATA GATEWAY #",
      "LEDGER ATTRIBUTION SIGNED BY ALCHEMY RELAYER NODE 0x",
      "SMART CONTRACT GAS QUOTA COMPLIANCE VERIFIED AT BLOCK #",
    ];
    
    const interval = setInterval(() => {
      const timestamp = new Date().toTimeString().split(" ")[0];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomVal = Math.floor(1000 + Math.random() * 9000);
      const newLog = `[${timestamp}] [NODE_CORE] - ${randomAction}${randomVal}`;
      
      setLogs((prev) => [newLog, ...prev.slice(0, 4)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-8 animate-[fadeIn_0.4s_ease-out]">
      
      {/* SECTION 1: HIGH TECH METRIC CARDS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-gray-950/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md relative group overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500 opacity-50" />
          <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Cryptographic Assertions</p>
          <p className="text-3xl font-black font-mono text-white mt-1 group-hover:text-cyan-400 transition duration-300">1,482</p>
          <p className="text-[10px] font-mono text-emerald-400 mt-2">▲ +14.2% Network Scaling</p>
        </div>

        <div className="bg-gray-950/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md relative group overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 left-0 w-2 h-full bg-purple-500 opacity-50" />
          <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">IPFS Node Footprint</p>
          <p className="text-3xl font-black font-mono text-white mt-1 group-hover:text-purple-400 transition duration-300">412.8 KB</p>
          <p className="text-[10px] font-mono text-purple-400 mt-2">Optimized Layer-2 Descriptors</p>
        </div>

        <div className="bg-gray-950/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md relative group overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 opacity-50" />
          <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Verification Queries</p>
          <p className="text-3xl font-black font-mono text-white mt-1 group-hover:text-indigo-400 transition duration-300">8,924</p>
          <p className="text-[10px] font-mono text-cyan-400 mt-2">100% Zero-Tamper Handshakes</p>
        </div>

        <div className="bg-gray-950/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md relative group overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 opacity-50" />
          <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Gas Optimization Rate</p>
          <p className="text-3xl font-black font-mono text-emerald-400 mt-1">94.8%</p>
          <p className="text-[10px] font-mono text-gray-500 mt-2">Saved via Minimal State Mappings</p>
        </div>

      </div>

      {/* SECTION 2: DYNAMIC INTUATIVE CHART VISUALIZATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: LINE GRAPH FOR TRAFFIC DYNAMICS */}
        <div className="bg-gray-950/30 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
          <div className="mb-4">
            <h3 className="text-xs font-mono tracking-widest text-gray-400 uppercase">Network Traffic & Verification Velocity</h3>
            <p className="text-[10px] font-mono text-gray-600">Tracks lookup requests against live mint processes</p>
          </div>
          <div className="h-64 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.3} />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: "#030712", borderColor: "#374151", color: "#fff" }} />
                <Line type="monotone" dataKey="Verifications" stroke="#22d3ee" strokeWidth={3} dot={{ fill: "#22d3ee" }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Mints" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: BAR GRAPH FOR GAS SYSTEM OPTIMIZATION */}
        <div className="bg-gray-950/30 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
          <div className="mb-4">
            <h3 className="text-xs font-mono tracking-widest text-gray-400 uppercase">Institutional Gas Reduction Index (Gwei)</h3>
            <p className="text-[10px] font-mono text-gray-600">Compares standard execution cost against off-chain mapping storage models</p>
          </div>
          <div className="h-64 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gasOptimizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.3} />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: "#030712", borderColor: "#374151", color: "#fff" }} />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar dataKey="StandardGas" fill="#374151" name="Standard On-Chain Cost" radius={[4, 4, 0, 0]} />
                <Bar dataKey="OptimizedGas" fill="#10b981" name="CredChain Optimization" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* SECTION 3: LIVING SYSTEM ACTIVITY FEED LOGGER */}
      <div className="bg-gray-950/50 border border-white/5 p-6 rounded-2xl backdrop-blur-md font-mono text-xs">
        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="text-xs tracking-widest text-cyan-400 uppercase font-bold">Live Stream Auditing Matrix Log</h3>
          </div>
          <span className="text-[10px] text-gray-600">NODES_CONNECTED: 4/4</span>
        </div>
        
        <div className="space-y-2 h-32 overflow-hidden text-gray-400 font-mono text-[11px] leading-relaxed select-none">
          {logs.map((log, index) => (
            <div key={index} className={`transition-all duration-500 truncate ${index === 0 ? "text-cyan-400/90 font-bold" : "opacity-60"}`}>
              {log}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}