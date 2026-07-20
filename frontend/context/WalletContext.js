"use client";

import { createContext, useContext, useState, useEffect } from "react";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (err) {
        console.error("User denied account access", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // UI Disconnection Module: Destroys active site session parameters
  const disconnectWallet = () => {
    setAccount("");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) setAccount(accounts[0]);
      });

      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || "");
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);