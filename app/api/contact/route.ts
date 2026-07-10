import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, message } = body;

    // 1. Validate inputs and types
    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      (message !== undefined && typeof message !== "string")
    ) {
      return NextResponse.json(
        { error: "Invalid input data types" },
        { status: 400 }
      );
    }

    // Clean inputs to prevent SMTP header injection (remove newlines from headers)
    const cleanFirstName = firstName.replace(/[\r\n]/g, "").trim();
    const cleanLastName = lastName.replace(/[\r\n]/g, "").trim();
    const cleanEmail = email.replace(/[\r\n]/g, "").trim();
    const cleanMessage = message ? message.trim() : "";

    if (!cleanFirstName || !cleanLastName || !cleanEmail) {
      return NextResponse.json(
        { error: "Required fields (First Name, Last Name, Email) are missing or invalid" },
        { status: 400 }
      );
    }

    // Length limit checks (DoS prevention)
    if (cleanFirstName.length > 100 || cleanLastName.length > 100) {
      return NextResponse.json(
        { error: "Names must be 100 characters or less" },
        { status: 400 }
      );
    }

    if (cleanEmail.length > 150) {
      return NextResponse.json(
        { error: "Email must be 150 characters or less" },
        { status: 400 }
      );
    }

    if (cleanMessage.length > 5000) {
      return NextResponse.json(
        { error: "Message must be 5000 characters or less" },
        { status: 400 }
      );
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // 2. Connect to database & save contact message
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("contacts").insertOne({
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: cleanEmail,
      message: cleanMessage,
      createdAt: new Date(),
    });

    // 3. Compose Email Content
    const recipientEmail = "contact@yaserkhanchowdhury.com";
    const emailSubject = `New Portfolio Message from ${cleanFirstName} ${cleanLastName}`;
    const emailBodyText = `
New Message from Minister's Portfolio Website:
---------------------------------------------
Name: ${cleanFirstName} ${cleanLastName}
Email: ${cleanEmail}
Date: ${new Date().toLocaleString()}

Message:
${cleanMessage || "No message provided."}
`;
    const emailBodyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #f9fbf9;">
        <h2 style="color: #006837; border-bottom: 2px solid #006837; padding-bottom: 10px;">New Message from Portfolio Website</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Sender Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${cleanFirstName} ${cleanLastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Sender Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${cleanEmail}" style="color: #006837;">${cleanEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Submission Date:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${new Date().toLocaleString()}</td>
          </tr>
        </table>
        <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 15px;">
          <h4 style="margin: 0 0 10px 0; color: #1a1a1a;">Message Content:</h4>
          <p style="margin: 0; color: #444444; line-height: 1.6; white-space: pre-wrap;">${cleanMessage || "No message provided."}</p>
        </div>
        <p style="font-size: 0.85rem; color: #666666; margin-top: 25px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 15px;">
          This message was sent via the contact form on yaserkhanchowdhury.com
        </p>
      </div>
    `;

    // 4. Set up Nodemailer Transporter
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    let emailSent = false;

    if (smtpUser && smtpPass) {
      console.log(`Attempting to send email to ${recipientEmail} via SMTP: ${smtpHost}:${smtpPort}...`);
      
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // True for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${cleanFirstName} ${cleanLastName}" <${smtpUser}>`, // Must be from authenticated user or aliases
        replyTo: cleanEmail, // Replies go to the sender's email
        to: recipientEmail,
        subject: emailSubject,
        text: emailBodyText,
        html: emailBodyHtml,
      });

      emailSent = true;
      console.log(`Email successfully forwarded to ${recipientEmail}`);
    } else {
      console.warn(
        `[SMTP Warning] SMTP credentials (SMTP_USER/SMTP_PASS) are not set in .env.local.\n` +
        `Simulating email delivery. Logged message content:\n` +
        `==================================================\n` +
        `${emailBodyText}\n` +
        `==================================================`
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        messageId: result.insertedId,
        emailSent: emailSent,
        databaseSaved: true
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("API contact submission error:", err);
    return NextResponse.json(
      { error: "Internal server error processing message" },
      { status: 500 }
    );
  }
}
