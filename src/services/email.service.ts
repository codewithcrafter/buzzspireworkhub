import { Resend } from "resend";

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing or undefined.");
  }
  return new Resend(apiKey);
};
import nodemailer from "nodemailer";

// Initialize transporter lazily using environment variables or a fallback/mock transport
const getTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.ethereal.email";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    // Return a mock transporter that logs emails to console for local development
    return {
      sendMail: async (options: nodemailer.SendMailOptions) => {
        console.log("---------------- EMAIL SIMULATION ----------------");
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Text: ${options.text}`);
        console.log("--------------------------------------------------");
        return { messageId: "mock-id-" + Date.now() };
      },
    } as unknown as nodemailer.Transporter;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};


export async function sendLeaveApprovedEmail(leave: any, employee: any) {
  try {
    const transporter = getTransporter();
    const subject = `Leave Request Approved — ${leave.leaveType}`;
    const text = `Hello ${employee.fullName},\n\nYour leave request for ${leave.totalDays} day(s) from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been APPROVED.\n\nRegards,\nBuzzSpire WorkHub HR Team`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "BuzzSpire HR <hr@buzzspiremedia.com>",
      to: employee.email,
      subject,
      text,
    });
  } catch (err) {
    console.error("[Email Workflow Error] sendLeaveApprovedEmail failed safely:", err);
  }
}

export async function sendLeaveRejectedEmail(leave: any, employee: any, rejectionReason?: string) {
  try {
    const transporter = getTransporter();
    const subject = `Leave Request Status Update — ${leave.leaveType}`;
    const reasonText = rejectionReason ? `Reason: ${rejectionReason}\n\n` : "";
    const text = `Hello ${employee.fullName},\n\nYour leave request for ${leave.totalDays} day(s) starting ${new Date(leave.startDate).toLocaleDateString()} was REJECTED.\n\n${reasonText}Regards,\nBuzzSpire WorkHub HR Team`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "BuzzSpire HR <hr@buzzspiremedia.com>",
      to: employee.email,
      subject,
      text,
    });
  } catch (err) {
    console.error("[Email Workflow Error] sendLeaveRejectedEmail failed safely:", err);
  }
}

export async function sendWelcomeEmail(employee: any) {
  try {
    const transporter = getTransporter();
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const subject = `Welcome to BuzzSpire WorkHub`;
    const text = `Hello ${employee.fullName},\n\nWelcome to BuzzSpire WorkHub! Your employee account (${employee.employeeId}) has been activated.\n\nPlease log in at: ${appUrl}/employee/login to access your workspace.\n\nRegards,\nBuzzSpire HR Team`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "BuzzSpire HR <hr@buzzspiremedia.com>",
      to: employee.email,
      subject,
      text,
    });
  } catch (err) {
    console.error("[Email Workflow Error] sendWelcomeEmail failed safely:", err);
  }
}

export async function sendSystemNotificationEmail(employee: any, title: string, message: string) {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "BuzzSpire WorkHub <notifications@buzzspiremedia.com>",
      to: employee.email,
      subject: title,
      text: `Hello ${employee.fullName},\n\n${message}\n\nRegards,\nBuzzSpire WorkHub`,
    });
  } catch (err) {
    console.error("[Email Workflow Error] sendSystemNotificationEmail failed safely:", err);
  }
}

