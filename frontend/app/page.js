"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

// NORMAL IMPORT - No dynamic Next.js magic to confuse Vercel
import AdminAnalytics from "../components/AdminAnalytics";

import CyberHome from "../components/CyberHome";
import IssuePortal from "./issue/page"; 
import HolderDashboard from "./dashboard/page"; 
import VerifyPortal from "../components/VerifyPortal";

// ... rest of your code stays exactly the same
export default function Home() {
  const [view, setView] = useState("home"); 
  const [scrolled, setScrolled] = useState(false);
  
  const cursorRef = useRef(null);
  const trailRef = useRef(null); 
  const logoRef = useRef(null);
  const meshRef = useRef(null);
  
  // Dynamic Graphic Design Navbar Ref nodes
  const navContainerRef = useRef(null);
  const glintTrackerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dual-node mouse tracking with fluid trailing physics
  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    const onMouseMove = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
      gsap.to(trail, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power3.out" });
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

  // HIGH TECH GRAPHIC HOVER MAPPING ENGINE
  const handleNavHover = (e) => {
    const targetLink = e.currentTarget;
    const tracker = glintTrackerRef.current;
    const container = navContainerRef.current;
    
    if (!tracker || !container) return;

    // Calculate relative coordinates and width dimensions inside the wrapper shell
    const targetRect = targetLink.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const relativeLeft = targetRect.left - containerRect.left;

    // Dynamic magnetic transition lock-on frame
    gsap.to(tracker, {
      opacity: 1,
      left: relativeLeft,
      width: targetRect.width,
      duration: 0.35,
      ease: "back.out(1.2)", 
      overwrite: "auto"
    });

    // Subtle scale feedback click on text node target
    gsap.to(targetLink, {
      scale: 1.05,
      color: "#22d3ee",
      duration: 0.2
    });
  };

  const handleNavLeave = (e) => {
    const targetLink = e.currentTarget;
    const tracker = glintTrackerRef.current;

    // Reset targeted element transformations safely
    gsap.to(targetLink, {
      scale: 1,
      color: view === targetLink.getAttribute("data-id") ? "#22d3ee" : "#9ca3af",
      duration: 0.2
    });
  };

  // Keep tracking element centered over the active view when mouse exits the bar entirely
  const handleNavContainerLeave = () => {
    const tracker = glintTrackerRef.current;
    const activeBtn = navContainerRef.current?.querySelector(`[data-id="${view}"]`);
    
    if (!tracker) return;

    if (activeBtn) {
      const containerRect = navContainerRef.current.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      const relativeLeft = btnRect.left - containerRect.left;

      gsap.to(tracker, {
        left: relativeLeft,
        width: btnRect.width,
        duration: 0.4,
        ease: "power2.out"
      });
    } else {
      gsap.to(tracker, {
        opacity: 0,
        duration: 0.3
      });
    }
  };

  // Recalculate tracker frame properties whenever the active view changes
  useEffect(() => {
    const container = navContainerRef.current;
    const tracker = glintTrackerRef.current;
    if (!container || !tracker) return;

    const activeBtn = container.querySelector(`[data-id="${view}"]`);
    if (activeBtn) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      
      gsap.to(tracker, {
        opacity: 1,
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
        duration: 0.4,
        ease: "power3.out"
      });
    }
  }, [view]);

  const navLinks = [
    { id: "home", label: "Core Hub" },
    { id: "issue", label: "Issue" },
    { id: "dashboard", label: "My Credentials" },
    { id: "verify", label: "Verify Portal" }, 
    { id: "revoke", label: "Revoke System" },
    { id: "admin", label: "Admin Setup" }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden relative">
      
      {/* 1. Sharp, Micro Core Custom Cursor */}
      <div ref={cursorRef} className="hidden md:block fixed top-0 left-0 w-3 h-3 bg-cyan-400 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-50 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

      {/* 2. Weightless Plasma Ghosting Trail Element */}
      <div ref={trailRef} className="hidden md:block fixed top-0 left-0 w-6 h-6 bg-gradient-to-r from-cyan-500/30 to-purple-500/10 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-40 mix-blend-screen blur-[2px] shadow-[0_0_20px_rgba(168,85,247,0.3)]" />

      {/* Animated Gradient Mesh Ambient Background Layer */}
      <div className="fixed inset-0 -z-20 overflow-hidden opacity-40">
        <div ref={meshRef} className="absolute w-[150vw] h-[150vw] -top-[50vw] -left-[25vw] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,rgba(168,85,247,0.1)_30%,rgba(0,0,0,0)_70%)] animate-[spin_120s_linear_infinite]" />
        <div className="absolute w-[120vw] h-[120vw] -bottom-[30vw] -right-[10vw] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,rgba(236,72,153,0.05)_40%,rgba(0,0,0,0)_60%)] animate-[spin_90s_linear_infinite_reverse]" />
      </div>

      {/* Cyberpunk Scanline Effect Overlay */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px]" />

      {/* Frosted Glass Navbar Panel */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${
        scrolled ? "py-3 bg-gray-950/70 backdrop-blur-xl border-purple-500/30 shadow-[0_4px_30px_rgba(168,85,247,0.2)]" : "py-6 bg-transparent border-white/5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Holographic Shimmer Brand Logo */}
          <div onClick={() => setView("home")} className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 transition duration-300">
              <span className="font-mono font-black text-black text-xl tracking-tighter">C</span>
            </div>
            <span ref={logoRef} className="text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent font-mono">CREDCHAIN</span>
          </div>

          {/* DYNAMIC METRIC TARGET LINK LAYOUT SHELL */}
          <div 
            ref={navContainerRef}
            onMouseLeave={handleNavContainerLeave}
            className="hidden md:flex items-center relative bg-gray-950/40 p-1.5 border border-white/5 rounded-full backdrop-blur-md"
          >
            {/* The Dynamic Floating Cyber-Bar Backplate Element */}
            <div 
              ref={glintTrackerRef}
              className="absolute top-1.5 bottom-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 border border-cyan-500/40 opacity-0 pointer-events-none shadow-[0_0_15px_rgba(34,211,238,0.2),inset_0_0_8px_rgba(34,211,238,0.1)] z-0"
              style={{ left: 0, width: 0 }}
            />

            {navLinks.map((link) => (
              <button
                key={link.id}
                data-id={link.id}
                onMouseEnter={handleNavHover}
                onMouseLeave={handleNavLeave}
                onClick={() => setView(link.id)}
                className={`relative z-10 px-5 py-2 rounded-full text-xs uppercase font-mono tracking-widest font-bold transition-colors duration-300 ${
                  view === link.id ? "text-cyan-400" : "text-gray-400"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

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
        {view !== "home" && (
          <button onClick={() => setView("home")} className="mb-8 self-start flex items-center space-x-2 px-4 py-2 border border-white/10 hover:border-cyan-500/40 bg-white/5 rounded-xl font-mono text-xs tracking-wider text-gray-400 hover:text-cyan-400 transition">
            <span>←</span> <span>BACK TO MAIN APP CENTER</span>
          </button>
        )}

        {view === "home" && <CyberHome onViewChange={setView} />}
        {view === "issue" && <div className="w-full max-w-4xl mx-auto animate-[fadeIn_0.4s_ease-out]"><IssuePortal initialTab="issue" /></div>}
        {view === "revoke" && <div className="w-full max-w-4xl mx-auto animate-[fadeIn_0.4s_ease-out]"><IssuePortal initialTab="revoke" /></div>}
        
        {/* ENHANCED ADMIN PORTAL WITH ANALYTICS ENGINE */}
        {view === "admin" && (
          <div className="w-full max-w-7xl mx-auto animate-[fadeIn_0.4s_ease-out]">
            <div className="mb-12 max-w-4xl mx-auto">
              <IssuePortal initialTab="admin" />
            </div>
            <div className="border-t border-white/5 pt-12">
              <h2 className="text-xl font-mono font-black uppercase tracking-wider text-white mb-6">System Health Workspace</h2>
              <AdminAnalytics />
            </div>
          </div>
        )}
        
        {view === "dashboard" && <div className="w-full max-w-7xl mx-auto animate-[fadeIn_0.4s_ease-out]"><HolderDashboard /></div>}
        {view === "verify" && <div className="w-full max-w-4xl mx-auto animate-[fadeIn_0.4s_ease-out]"><VerifyPortal /></div>}
      </main>

      <footer className="w-full py-6 text-center text-gray-600 text-xs font-mono border-t border-white/5 relative z-10 bg-transparent">
        Secured by Sepolia Testnet & IPFS Storage Pipelines
      </footer>
    </div>
  );
}