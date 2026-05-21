"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CyberHome({ onViewChange }) {
  const heroRef = useRef(null);
  const cardGridRef = useRef(null);

  // High-performance staggered slide-in and anti-gravity idle float initialization
  useEffect(() => {
    // Reveal animation sequence
    gsap.fromTo(heroRef.current.children, 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power4.out", stagger: 0.15 }
    );

    gsap.fromTo(cardGridRef.current.children,
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, delay: 0.4 }
    );

    // Continuous weightless anti-gravity idle bobbing animation loop
    const cards = cardGridRef.current.children;
    Array.from(cards).forEach((card, idx) => {
      gsap.to(card, {
        y: "max(-12px, -4%)",
        duration: 3 + idx * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }, []);

  // 3D Perspective Tilt calculations mapping cursor position
  const handleMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const angleX = (yc - y) / 10;
    const angleY = (x - xc) / 10;

    gsap.to(card, {
      rotateX: angleX,
      rotateY: angleY,
      transformPerspective: 800,
      ease: "power1.out",
      duration: 0.3,
      overwrite: "auto"
    });
  };

  const handleMouseLeave = (card) => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "power2.out",
      duration: 0.5,
      overwrite: "auto"
    });
  };

  return (
    <div className="w-full space-y-20">
      
      {/* Grand Hero Segment Deck */}
      <div ref={heroRef} className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-block px-4 py-1 border border-purple-500/30 bg-purple-950/20 rounded-full text-xs font-mono font-bold tracking-[0.2em] text-purple-400 uppercase shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          Decentralized Identity Infrastructure
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase">
          Next Generation <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 dropping-shadow">
            Web3 Credentials
          </span>
        </h1>
        
        <p className="text-lg text-gray-400 max-w-2xl mx-auto font-sans leading-relaxed">
          Welcome to <strong className="text-white font-mono">CredChain</strong>. A secure tamper-proof infrastructure bridging academic integrity and cryptographic assurance via absolute zero-knowledge verification frameworks.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => onViewChange("issue")}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-mono text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95"
          >
            Launch Mint Core
          </button>
          
          {/* UPDATED: Text changed to "Check Credential" */}
          <button 
            onClick={() => onViewChange("verify")}
            className="px-8 py-4 rounded-xl bg-gray-900 border border-white/10 hover:border-purple-500/40 font-mono text-xs font-black tracking-widest uppercase transition-all duration-300 hover:bg-gray-800"
          >
            Check Credential
          </button>
        </div>
      </div>

      {/* Feature Navigation Cards Deck */}
      <div 
        ref={cardGridRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pt-10"
      >
        {/* Card 1 */}
        <div 
          onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
          onClick={() => onViewChange("issue")}
          className="bg-gray-950/40 border border-white/5 p-8 rounded-2xl backdrop-blur-md cursor-pointer hover:border-cyan-500/40 shadow-xl transition-all duration-300 group flex flex-col justify-between h-64 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
        >
          <div>
            <div className="w-12 h-12 bg-cyan-950/30 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 mb-6 font-mono font-bold group-hover:scale-110 transition duration-300">01</div>
            <h3 className="text-xl font-bold font-mono tracking-wide text-white uppercase group-hover:text-cyan-400 transition">Mint Portal</h3>
            <p className="text-sm text-gray-400 mt-2 font-sans">Authorized institutions can permanently anchor verified academic student tokens straight onto the public ledger.</p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-500 tracking-widest uppercase mt-4 block group-hover:translate-x-2 transition-transform">Initialize Process →</span>
        </div>

        {/* Card 2 */}
        <div 
          onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
          onClick={() => onViewChange("dashboard")}
          className="bg-gray-950/40 border border-white/5 p-8 rounded-2xl backdrop-blur-md cursor-pointer hover:border-purple-500/40 shadow-xl transition-all duration-300 group flex flex-col justify-between h-64 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
        >
          <div>
            <div className="w-12 h-12 bg-purple-950/30 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 mb-6 font-mono font-bold group-hover:scale-110 transition duration-300">02</div>
            <h3 className="text-xl font-bold font-mono tracking-wide text-white uppercase group-hover:text-purple-400 transition">Secure Vault</h3>
            <p className="text-sm text-gray-400 mt-2 font-sans">Students can view acquired achievements, track IPFS verification hashes, and print dynamic vectorized PDF certificates.</p>
          </div>
          <span className="text-xs font-mono font-bold text-purple-500 tracking-widest uppercase mt-4 block group-hover:translate-x-2 transition-transform">Open Archive →</span>
        </div>

        {/* Card 3 */}
        <div 
          onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
          onClick={() => onViewChange("revoke")}
          className="bg-gray-950/40 border border-white/5 p-8 rounded-2xl backdrop-blur-md cursor-pointer hover:border-red-500/40 shadow-xl transition-all duration-300 group flex flex-col justify-between h-64 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]"
        >
          <div>
            <div className="w-12 h-12 bg-red-950/30 border border-red-500/30 rounded-xl flex items-center justify-center text-red-400 mb-6 font-mono font-bold group-hover:scale-110 transition duration-300">03</div>
            <h3 className="text-xl font-bold font-mono tracking-wide text-white uppercase group-hover:text-red-400 transition">Revocation Core</h3>
            <p className="text-sm text-gray-400 mt-2 font-sans">Administrative control unit to invalidate identifiers and safely declare contract ledger compliance anomalies.</p>
          </div>
          <span className="text-xs font-mono font-bold text-red-500 tracking-widest uppercase mt-4 block group-hover:translate-x-2 transition-transform">Access Terminal →</span>
        </div>
      </div>

    </div>
  );
}