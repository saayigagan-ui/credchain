# 🔗 CredChain

CredChain is an enterprise-grade, decentralized credential issuance and verification platform built on the Ethereum blockchain. It provides a secure, tamper-proof, and gas-optimized solution for institutions to issue digital credentials, and for employers to instantly verify them with zero-trust architecture.

## 🚀 Key Features

*   **Role-Based Access Control (RBAC):** Zero-trust architecture strictly separating Super Admin (Contract Owner) from Approved Issuers (e.g., Universities, Bootcamps).
*   **Gas-Optimized Smart Contracts:** Leverages off-chain IPFS storage (via Pinata) for rich metadata, keeping on-chain state minimal and execution costs aggressively low.
*   **Commercial Multi-Tenancy:** A single smart contract deployment supports multiple isolated institutions, enabling a scalable SaaS model without replicating codebases.
*   **Instant Bulk Verification:** Custom Solidity `verifyBulk` functions allow HR departments and background check agencies to verify dozens of credentials in a single node request.
*   **Real-Time Analytics Dashboard:** Live, on-chain telemetry extrapolating gas savings, IPFS storage footprints, and network block states via mathematically modeled extrapolations.

## 🛠️ Tech Stack

*   **Frontend:** Next.js 14, React, Tailwind CSS
*   **Web3 Integration:** Ethers.js (v6)
*   **Smart Contracts:** Solidity, Hardhat, OpenZeppelin (ERC721, Ownable)
*   **Decentralized Storage:** IPFS & Pinata Gateway
*   **Data Visualization:** Recharts
*   **Network:** Ethereum Sepolia Testnet

## ⚙️ Getting Started (Local Development)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-username/credchain.git
cd credchain/frontend
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a `.env.local` file in the `frontend` directory and add your specific configurations (if applicable for your Pinata keys or RPC URLs):
\`\`\`env
NEXT_PUBLIC_PINATA_API_KEY=your_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_secret
\`\`\`
*(Note: Ensure your `utils/contract.js` is updated with your latest deployed Sepolia contract address).*

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔐 Security & Access

The application utilizes strict frontend and smart contract route-guarding. 
*   **Super Admin:** Can register and revoke issuers, and view network analytics. Must connect with the wallet address that deployed the contract.
*   **Approved Issuers:** Can mint new ERC-721 credentials and revoke credentials they specifically issued. 
*   **Public Users:** Can view their own credential wallet and use the public verification portal to check hashes.

## 📄 License
This project is licensed under the MIT License.
