import "./global.css"; // Looks locally in the same 'app' folder for your singular global.css file
import { WalletProvider } from "../context/WalletContext"; // Steps out of 'app' and moves into the 'context' folder

export const metadata = {
  title: "CredChain - Academic Verification",
  description: "Decentralized credential verification engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 antialiased text-white">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}