"use client";
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CertificateTemplate from './CertificateTemplate'; // Adjust path if needed
import QRShare from "./QRShare";

export default function CredentialCard({ credential }) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // This reference points to our hidden template
  const certificateRef = useRef(null);
  
  // Extract the IPFS Hash, or provide a fallback warning if the dashboard missed it
  const certificateId = credential.ipfsHash || credential.tokenURI || "Hash_Not_Found_In_Dashboard";
  
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verify?id=${certificateId}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(certificateId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    const element = certificateRef.current;
    if (!element) return;

    try {
      // 1. Take a high-resolution screenshot of the hidden HTML
      const canvas = await html2canvas(element, {
        scale: 2, // Doubles the pixel density for crisp text
        useCORS: true, // Allows cross-origin images
      });

      // 2. Convert it to an image format
      const imgData = canvas.toDataURL('image/png');

      // 3. Initialize a landscape PDF matching our exact pixel dimensions
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1056, 816] 
      });

      // 4. Paste the image into the PDF and trigger the browser download
      pdf.addImage(imgData, 'PNG', 0, 0, 1056, 816);
      pdf.save(`Certificate_${certificateId.substring(0, 8)}.pdf`);
      
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("There was an issue generating your certificate.");
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl relative overflow-hidden group shadow-xl hover:border-gray-500 transition flex flex-col justify-between h-full">
      
      {/* The Hidden Template (User won't see this on the web page) */}
      <div className="overflow-hidden h-0 w-0">
        <CertificateTemplate ref={certificateRef} credential={{...credential, ipfsHash: certificateId}}
        shareUrl={shareUrl}
         />
      </div>

      <div>
        {/* Revoked Stamp */}
        {credential.revoked && (
          <div className="absolute top-6 right-[-30px] bg-red-600 text-white text-xs font-black tracking-widest px-10 py-1 shadow-lg transform rotate-45 z-20 opacity-90 border-y border-red-400">
            REVOKED
          </div>
        )}
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">
              Certificate ID
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono text-blue-400 bg-blue-950/40 border border-blue-900/50 px-2 py-1 rounded-md truncate max-w-[150px]">
                {certificateId}
              </span>
              <button 
                onClick={handleCopyId}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <button 
            onClick={() => setShowQR(!showQR)}
            className="text-gray-400 hover:text-white text-sm bg-gray-900/50 border border-gray-700/60 px-3 py-1.5 rounded-lg transition"
          >
            {showQR ? "Hide QR" : "QR Code"}
          </button>
        </div>

        {showQR ? (
          <div className="py-4 flex justify-center animate-fadeIn">
            <QRShare url={shareUrl} />
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white">{credential.degree || "Degree"}</h3>
              <p className="text-md text-emerald-400 mt-1">{credential.studentName || "Student"}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-700/60 flex flex-col space-y-1.5 text-xs font-mono text-gray-500">
              <p className="truncate">
                <span className="text-gray-400">Issuer:</span> {credential.issuerName} 
                <span className="text-gray-600 text-[10px] ml-2">({credential.issuerAddress?.substring(0,6)}...)</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Download PDF Button */}
      <button 
        onClick={handleDownloadPdf}
        className="w-full mt-6 px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-900/50 hover:border-blue-500 font-semibold rounded-lg shadow-md transition-all duration-200"
      >
        Download Official PDF
      </button>
    </div>
  );
}