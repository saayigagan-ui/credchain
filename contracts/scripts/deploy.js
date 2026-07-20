const hre = require("hardhat");

async function main() {
  console.log("-----------------------------------------");
  console.log("Starting CredChain deployment process...");
  console.log("-----------------------------------------");

  const CredChain = await hre.ethers.getContractFactory("CredChain");
  
  console.log("Deploying contract artifact to Sepolia...");
  const credChain = await CredChain.deploy();
  
  console.log("Waiting for block confirmation on-chain...");
  await credChain.waitForDeployment();

  const address = await credChain.getAddress();
  console.log("=========================================");
  console.log("SUCCESS: CredChain deployed to:", address);
  console.log("=========================================");

  // Auto-approve the deployer as a test issuer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Approving deployer account as default issuer...");
  const tx = await credChain.approveIssuer(deployer.address, "Demo University");
  await tx.wait();
  console.log("Issuer Approved successfully:", deployer.address);
  console.log("-----------------------------------------");
}

main().catch((error) => {
  console.error("DEPLOYMENT FAILED:");
  console.error(error);
  process.exitCode = 1;
});