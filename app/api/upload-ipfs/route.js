import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: body,
        pinataMetadata: { name: `credchain-${Date.now()}` },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Pinata Server rejected payload: ${errText}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ipfsHash: data.IpfsHash });
  } catch (error) {
    console.error("IPFS Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}