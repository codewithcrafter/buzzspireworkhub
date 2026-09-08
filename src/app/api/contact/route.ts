import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, company, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Save lead to database
    await prisma.lead.create({
      data: {
        name,
        email,
        company,
        message,
        status: "NEW",
      },
    });

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || "user",
        pass: process.env.SMTP_PASS || "pass",
      },
    });

    // We don't block on this if SMTP is not configured properly in dev
    if (process.env.SMTP_HOST) {
      try {
        await transporter.sendMail({
          from: `"${name}" <${email}>`,
          to: process.env.CONTACT_EMAIL || "hello@buzzspire.media",
          subject: `New Contact Request from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nMessage: ${message}`,
        });
      } catch (emailError) {
        console.error("Failed to send contact email notification:", emailError);
        // Do NOT fail the response, lead was already successfully created in the database
      }
    }

    return NextResponse.json({ success: true, message: "Message received" }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
