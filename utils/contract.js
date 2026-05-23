// frontend/utils/contract.js

// Paste your fresh Sepolia address here
export const CONTRACT_ADDRESS = "0x8a00EAe3C17FfC66b3092106814ef8059CDF6924";

export const CONTRACT_ABI = [
  "function approveIssuer(address issuer, string memory name) external",
  "function revokeIssuer(address issuer) external",
  "function issueCredential(address recipient, string memory ipfsHash, string memory credentialType, bytes32 credentialHash) external returns (uint256)",
  "function revokeCredential(uint256 tokenId) external",
  "function verifyCredential(uint256 tokenId) external returns (bool)",
  
  // NEW BULK FUNCTION (Required for your new feature)
  "function verifyBulk(uint256[] calldata ids) external view returns (bool[] memory)",
  
  "function getHolderCredentials(address holder) external view returns (uint256[] memory)",
  "function getCredential(uint256 tokenId) external view returns (tuple(uint256 tokenId, address issuer, address recipient, string ipfsHash, bytes32 credentialHash, uint256 issuedAt, bool revoked, string credentialType))",
  "function totalCredentials() external view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function owner() public view returns (address)",
  "function issuerNames(address) public view returns (string)",
  "event IssuerApproved(address indexed issuer, string name)",
  "event CredentialIssued(uint256 indexed tokenId, address indexed issuer, address indexed recipient, string credentialType)",
  "event CredentialRevoked(uint256 indexed tokenId, address indexed issuer)",
  "event CredentialVerified(uint256 indexed tokenId, address indexed verifier, bool valid)"
];