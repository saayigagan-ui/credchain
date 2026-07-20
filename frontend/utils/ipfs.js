/**
 * Uploads credential metadata JSON to IPFS via Pinata
 * @param {Object} metadata - The credential details (name, degree, recipient address, etc.)
 * @returns {Promise<string>} The IPFS Hash (CID) of the uploaded file
 */
export const uploadMetadataToIPFS = async (metadata) => {
  try {
    const apiKey = process.env.PINATA_API_KEY || "2d635ebf707e6323827a";
    const apiSecret = process.env.PINATA_SECRET_KEY || "7a91a31a532a870a5dda28cd414c3487c531a4ac881c73e7d0ef49ca239f909a";

    if (!apiKey || !apiSecret) {
      throw new Error("Pinata API credentials missing in environment variables.");
    }

    // Format payload specifically for Pinata's standard JSON pinning endpoint
    const data = JSON.stringify({
      pinataContent: {
        ...metadata,
        description: "Verified Academic Credential secured by CredChain.",
        image: "https://gateway.pinata.cloud/ipfs/QmZV9rW7uA2fXqC3U4p8vX6wZ7S5v9bT3Y7R7Y7R7Y7R7R", // Default fallback credential badge
      },
      pinataMetadata: {
        name: `CredChain-${metadata.recipient || 'Credential'}-${Date.now()}.json`,
      },
    });

    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.details || "Failed to upload to Pinata");
    }

    const resData = await response.json();
    return resData.IpfsHash; // This returns the unique CID string
  } catch (error) {
    console.error("Error inside uploadMetadataToIPFS utility:", error);
    throw error;
  }
};