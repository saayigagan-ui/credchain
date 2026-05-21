"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

// Sub-components loaded to create a seamless, single-page state flow
import CyberHome from "../components/CyberHome";
import IssuePortal from "./issue/page"; 
import HolderDashboard from "./dashboard/page"; 
import VerifyPortal from "../components/VerifyPortal"; // <-- ADDED: Verify Portal Import

export default function Home() {
  const [view, setView] = useState("home"); // "home", "issue", "dashboard", "revoke", "admin", "verify"
  const [scrolled, setScrolled] = useState(false);
  
  const cursorRef = useRef(null);
  const trailRef = useRef(null); // Reference for the physics trail
  const logoRef = useRef(null);
  const meshRef = useRef(null);

  // Monitor scroll height for navbar compression updates
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sleek dual-node mouse tracking with fluid trailing physics
  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    const onMouseMove = (e) => {
      // 1. Sharp, responsive core dot
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });

      // 2. Weightless ghosting plasma trail that tags along slightly later
      gsap.to(trail, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power3.out"
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Holographic rainbow shimmer effect cycling on logo text
  useEffect(() => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        backgroundPosition: "200% center",
        duration: 4,
        repeat: -1,
        ease: "linear"
      });
    }
  }, []);

  const navLinks = [
    { id: "home", label: "Core Hub" },
    { id: "issue", label: "Issue" },
    { id: "dashboard", label: "My Credentials" },
    { id: "verify", label: "Verify Portal" }, // <-- ADDED: Verify link to navbar
    { id: "revoke", label: "Revoke System" },
    { id: "admin", label: "Admin Setup" }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden relative">
      
      {/* 1. Sharp, Micro Core Custom Cursor */}
      <div 
        ref={cursorRef}
        className="hidden md:block fixed top-0 left-0 w-3 h-3 bg-cyan-400 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-50 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
      />

      {/* 2. Weightless Plasma Ghosting Trail Element */}
      <div 
        ref={trailRef}
        className="hidden md:block fixed top-0 left-0 w-6 h-6 bg-gradient-to-r from-cyan-500/30 to-purple-500/10 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-40 mix-blend-screen blur-[2px] shadow-[0_0_20px_rgba(168,85,247,0.3)]"
      />

      {/* Animated Gradient Mesh Ambient Background Layer */}
      <div className="fixed inset-0 -z-20 overflow-hidden opacity-40">
        <div 
          ref={meshRef}
          className="absolute w-[150vw] h-[150vw] -top-[50vw] -left-[25vw] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,rgba(168,85,247,0.1)_30%,rgba(0,0,0,0)_70%)] animate-[spin_120s_linear_infinite]"
        />
        <div className="absolute w-[120vw] h-[120vw] -bottom-[30vw] -right-[10vw] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,rgba(236,72,153,0.05)_40%,rgba(0,0,0,0)_60%)] animate-[spin_90s_linear_infinite_reverse]" />
      </div>

      {/* Cyberpunk Scanline Effect Overlay */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px]" />

      {/* Frosted Glass Navbar Panel */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${
        scrolled 
          ? "py-3 bg-gray-950/70 backdrop-blur-xl border-purple-500/30 shadow-[0_4px_30px_rgba(168,85,247,0.2)]" 
          : "py-6 bg-transparent border-white/5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Holographic Shimmer Brand Logo */}
          <div 
            onClick={() => setView("home")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 transition duration-300">
              <span className="font-mono font-black text-black text-xl tracking-tighter">C</span>
            </div>
            <span 
              ref={logoRef}
              className="text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent font-mono"
            >
              CREDCHAIN
            </span>
          </div>

          {/* Liquid Underline Segment Links */}
          <div className="hidden md:flex items-center space-x-1 bg-gray-950/40 p-1.5 border border-white/5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setView(link.id)}
                className={`relative px-5 py-2 rounded-full text-xs uppercase font-mono tracking-widest font-bold transition-all duration-300 ${
                  view === link.id 
                    ? "text-cyan-400 shadow-[inset_0_0_12px_rgba(34,211,238,0.15)] border border-cyan-500/30 bg-cyan-950/25" 
                    : "text-gray-400 hover:text-white border border-transparent"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Decentralized Network Ledger Active CTA Hook */}
          <div>
            <div className="px-4 py-1.5 border border-emerald-500/30 bg-emerald-950/20 rounded-full flex items-center space-x-2 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">Sepolia Connected</span>
            </div>
          </div>

        </div>
      </nav>

      {/* Main Container Viewport Frame */}
      <main className="pt-36 pb-16 px-6 max-w-7xl mx-auto relative z-10 min-h-screen flex flex-col justify-center">
        
        {/* Context Back Link to Terminal Home */}
        {view !== "home" && (
          <button 
            onClick={() => setView("home")}
            className="mb-8 self-start flex items-center space-x-2 px-4 py-2 border border-white/10 hover:border-cyan-500/40 bg-white/5 rounded-xl font-mono text-xs tracking-wider text-gray-400 hover:text-cyan-400 transition"
          >
            <span>←</span> <span>BACK TO MAIN APP CENTER</span>
          </button>
        )}

        {/* VIEW 1: Grand Home Dashboard Entry Page */}
        {view === "home" && <CyberHome onViewChange={setView} />}

        {/* VIEW 2: Issue Portal Module */}
        {view === "issue" && (
          <div className="w-full max-w-4xl mx-auto animate-[fadeIn_0.4s_ease-out]">
            <IssuePortal initialTab="issue" />
          </div>
        )}

        {/* VIEW 3: Revocation Core Administrative Module */}
        {view === "revoke" && (
          <div className="w-full max-w-4xl mx-auto animate-[fadeIn_0.4s_ease-out]">
            <IssuePortal initialTab="revoke" />
          </div>
        )}

        {/* VIEW 4: Admin Setup Module */}
        {view === "admin" && (
          <div className="w-full max-w-4xl mx-auto animate-[fadeIn_0.4s_ease-out]">
            <IssuePortal initialTab="admin" />
          </div>
        )}

        {/* VIEW 5: Live Secure Holder Vault Dashboard Module */}
        {view === "dashboard" && (
          <div className="w-full max-w-7xl mx-auto animate-[fadeIn_0.4s_ease-out]">
            <HolderDashboard />
          </div>
        )}

        {/* VIEW 6: Live Verification Portal Component */}
        {view === "verify" && (
          <div className="w-full max-w-4xl mx-auto animate-[fadeIn_0.4s_ease-out]">
            <VerifyPortal />
          </div>
        )}

      </main>

      {/* Cyber Infrastructure Ground Identity Footer */}
      <footer className="w-full py-6 text-center text-gray-600 text-xs font-mono border-t border-white/5 relative z-10 bg-transparent">
        Secured by Sepolia Testnet & IPFS Storage Pipelines
      </footer>

    </div>
  );
}