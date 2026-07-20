"use client";

export default function QRShare({ url }) {
  // Constructing standard QR image request using a public encoding engine
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("Verification URL copied to clipboard!");
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-center p-2">
      <div className="bg-white p-3 rounded-xl shadow-inner">
        <img src={qrImageUrl} alt="Verification QR Code" className="w-[130px] h-[130px]" />
      </div>
      <button 
        onClick={copyToClipboard}
        className="text-xs text-blue-400 underline hover:text-blue-300 font-mono transition"
      >
        Copy Text URL Address
      </button>
    </div>
  );
}