export const CONTRACT_ADDRESS = "0x938380A15F25eB4ce01Bb6875DD5115A6A09bAA1";

// The human-readable ABI for the exact functions we will call in the app
export const CONTRACT_ABI = [
  // --- NEW FUNCTIONS ADDED HERE ---
  "function approveIssuer(address issuer, string name)",
  
  // --- EXISTING FUNCTIONS ---
  "function approvedIssuers(address) view returns (bool)",
  "function issuerNames(address) view returns (string)",
  "function getHolderCredentials(address holder) view returns (uint256[])",
  "function getCredential(uint256 tokenId) view returns (tuple(uint256 tokenId, address issuer, address recipient, string ipfsHash, bytes32 credentialHash, uint256 issuedAt, bool revoked, string credentialType))",
  "function issueCredential(address recipient, string ipfsHash, string credentialType, bytes32 credentialHash) returns (uint256)",
  "function revokeCredential(uint256 tokenId)",
  "function verifyCredential(uint256 tokenId) returns (bool)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function totalCredentials() view returns (uint256)"
];
//0x0B1d4EeB51D6F6F9fc43962AA7d676c7701FF005