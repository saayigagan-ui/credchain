import React, { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Forces a canvas render so the PDF can "see" it

const CertificateTemplate = forwardRef(({ credential, shareUrl }, ref) => {
  
  // Safe date parsing to prevent "Invalid Date" errors
  const formattedDate = credential?.issuedAt 
    ? new Date(Number(credential.issuedAt) * 1000).toLocaleDateString() 
    : new Date().toLocaleDateString();

  // STRICTLY bind to the student's actual name
  const student = credential?.studentName || "Student Name Not Provided";
  
  const degree = credential?.degree || credential?.credentialType || "Degree Title Missing";
  const issuer = credential?.issuerName || "Authorized Institution";
  const idHash = credential?.ipfsHash || credential?.tokenURI || "ID_MISSING";

  // Fallback URL just in case
  const finalQrUrl = shareUrl || `https://yourdomain.com/verify?id=${idHash}`;

  return (
    <div 
      ref={ref} 
      className="w-[1056px] h-[816px] bg-white text-black p-12 flex flex-col justify-center items-center border-[24px] border-gray-900"
      style={{ position: 'absolute', top: '-9999px', left: '-9999px' }} 
    >
      <div className="border-4 border-gray-200 p-12 w-full h-full flex flex-col items-center justify-between text-center relative">
        
        <div className="mt-8">
          <h1 className="text-6xl font-serif font-bold text-gray-900 mb-6 uppercase tracking-widest">Certificate</h1>
          <p className="text-2xl text-gray-600 italic">This is to proudly certify that</p>
        </div>
        
        {/* Student Name */}
        <h2 className="text-5xl font-bold text-blue-900 my-6 border-b-2 border-gray-300 pb-4 min-w-[500px]">
          {student}
        </h2>
        
        <div className="mb-8">
          <p className="text-2xl text-gray-600 italic mb-4">has been officially awarded the</p>
          {/* Degree/Course Name */}
          <h3 className="text-4xl font-semibold text-gray-800">{degree}</h3>
        </div>
        
        <div className="w-full flex justify-between items-end mt-16 px-12">
          
          {/* Signature Block */}
          <div className="flex flex-col items-center pb-6">
            <h4 className="text-2xl font-serif italic text-gray-800 mb-2">{issuer}</h4>
            <div className="w-64 border-b-2 border-gray-800 mb-2"></div>
            <p className="font-semibold text-gray-700 uppercase tracking-wider">Authorized Issuer</p>
            <p className="text-sm text-gray-500 mt-1">Date: {formattedDate}</p>
          </div>
          
          {/* Fully Functional QR Code Section */}
          <div className="flex flex-col items-center max-w-[220px]">
            <div className="bg-white p-3 border-2 border-gray-200 rounded-xl shadow-sm mb-3">
              <QRCodeCanvas 
                value={finalQrUrl} 
                size={110} 
                level={"H"} // High error correction so it scans easily on paper
                includeMargin={false}
              />
            </div>
            {/* Break-all ensures the long hash text wraps gracefully */}
            <p className="text-[10px] text-gray-500 font-mono break-all text-center leading-tight">
              ID: {idHash}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
});

CertificateTemplate.displayName = "CertificateTemplate";
export default CertificateTemplate;