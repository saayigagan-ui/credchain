import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Initialize the secure Gmail SMTP transporter using your environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const { email, studentName, degree, ipfsHash, issuerName, action } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    let emailSubject = '';
    let emailHtml = '';

    // Handle Issuance Template
    if (action === 'issue') {
      emailSubject = `🎓 Credential Issued: ${degree} - ${issuerName}`;
      emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #1e3a8a; margin-bottom: 4px;">Congratulations, ${studentName}!</h2>
          <p style="font-size: 16px; color: #334155; line-height: 1.5;">
            An official digital credential has been securely issued and stamped onto the blockchain for you by <strong>${issuerName}</strong>.
          </p>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">CREDENTIAL DETAILS</p>
            <p style="margin: 0 0 6px 0; font-size: 16px; color: #0f172a;"><strong>Degree/Course:</strong> ${degree}</p>
            <p style="margin: 0; font-size: 14px; color: #0f172a; word-break: break-all;"><strong>Certificate ID (IPFS Hash):</strong> <code style="background-color: #e2e8f0; padding: 2px 4px; border-radius: 4px;">${ipfsHash}</code></p>
          </div>
          <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
            This document is tamper-proof and permanently verifiable. You can view, share, or download your official PDF at any time via your student credentials dashboard.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">Powered by CredChain Secure Web3 Core Engine</p>
        </div>
      `;
    } 
    // Handle Revocation Template
    else if (action === 'revoke') {
      emailSubject = `⚠️ Security Alert: Credential Revoked`;
      emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fee2e2; border-radius: 12px;">
          <h2 style="color: #991b1b; margin-bottom: 4px;">Credential Revocation Notice</h2>
          <p style="font-size: 16px; color: #334155; line-height: 1.5;">
            This email is to notify you that the credential previously associated with your profile has been officially <strong>REVOKED</strong> by the issuing institution (<strong>${issuerName}</strong>).
          </p>
          <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #991b1b;">REVOCATION DETAILS</p>
            <p style="margin: 0 0 6px 0; font-size: 16px; color: #7f1d1d;"><strong>Degree/Course:</strong> ${degree}</p>
            <p style="margin: 0; font-size: 14px; color: #7f1d1d; word-break: break-all;"><strong>Certificate ID:</strong> <code>${ipfsHash}</code></p>
          </div>
          <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
            The verification status of this specific hash identifier on the blockchain network will now flag a permanent <strong>REVOKED</strong> status warning during lookups.
          </p>
          <hr style="border: 0; border-top: 1px solid #fee2e2; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">CredChain Network Administration Security Alert</p>
        </div>
      `;
    }

    // Fire the email utilizing Nodemailer and Gmail SMTP transport
    await transporter.sendMail({
      from: `"CredChain" <${process.env.EMAIL_USER}>`,
      to: email, 
      subject: emailSubject,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Nodemailer SMTP Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}