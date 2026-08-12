import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
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

export async function sendInvitationEmail(email: string, name: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteUrl = `${appUrl}/invite/accept?token=${token}`;

  const transporter = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to BuzzSpire Media</title>
        <style>
          body {
            font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #030712;
            color: #f3f4f6;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper {
            width: 100%;
            background-color: #030712;
            padding: 40px 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #0b0f19;
            border: 1px solid #1f2937;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          }
          .header {
            background: linear-gradient(135deg, #7c3aed 0%, #d946ef 100%);
            padding: 40px;
            text-align: center;
          }
          .logo {
            font-size: 28px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -1px;
          }
          .content {
            padding: 40px;
          }
          h1 {
            font-size: 24px;
            color: #ffffff;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 700;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            color: #9ca3af;
            margin-bottom: 30px;
          }
          .btn-container {
            text-align: center;
            margin: 40px 0;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #7c3aed 0%, #d946ef 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 32px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 14px;
            box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.3);
            transition: all 0.3s ease;
          }
          .footer {
            padding: 30px 40px;
            border-top: 1px solid #1f2937;
            text-align: center;
            font-size: 12px;
            color: #4b5563;
            background-color: #080c14;
          }
          .footer a {
            color: #9ca3af;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="logo">BuzzSpire Media</div>
            </div>
            <div class="content">
              <h1>Hello ${name},</h1>
              <p>You have been invited as a premium client to join <strong>BuzzSpire Media</strong>. Your portal dashboard is ready for you.</p>
              <p>Please click the button below to set up your password and access your dashboard. Note that this invitation link is secure and will expire in 24 hours.</p>
              
              <div class="btn-container">
                <a href="${inviteUrl}" class="btn">Create Password</a>
              </div>
              
              <p style="font-size: 14px; color: #4b5563;">If the button above does not work, copy and paste the following link into your browser:<br>
              <a href="${inviteUrl}" style="color: #a78bfa; text-decoration: none; word-break: break-all;">${inviteUrl}</a></p>
            </div>
            <div class="footer">
              &copy; 2026 BuzzSpire Media. All rights reserved.<br>
              This is an automated operational notification. Please do not reply directly to this email.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const { data, error } = await resend.emails.send({
    from: "BuzzSpire Media <onboarding@resend.dev>",
    to: email,
    subject: "Accept Invitation to BuzzSpire Media Portal",
    html: htmlContent,
    text: `Hello ${name},

You have been invited to BuzzSpire Media.

Create your password here:

${inviteUrl}

This link expires in 24 hours.`,
  });

  console.log("Resend Data:", data);

  if (error) {
    console.error("Resend Error:", error);
    throw new Error(error.message);
  }
}
