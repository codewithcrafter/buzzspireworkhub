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

export async function sendInvitationEmail(email: string, name: string, token: string) {
  const appUrl = process.env.APP_URL || "https://buzzspiremedia.com";
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

  const { data, error } = await getResendClient().emails.send({
    from: process.env.EMAIL_FROM || "BuzzSpire Sales <sales@buzzspiremedia.com>",
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

export async function sendClientWelcomeEmail(email: string, name: string, passwordText: string, service: string) {
  const appUrl = process.env.APP_URL || "https://buzzspiremedia.com";
  const loginUrl = `${appUrl}/login`; // Using the standard login route

  const transporter = getTransporter();

  let serviceSpecificText = "";
  if (service.toLowerCase().includes("ppc") || service.toLowerCase().includes("ads") || service.toLowerCase().includes("paid")) {
    serviceSpecificText = "Your account has been set up for PPC / Paid Ads (Google Ads). Our team will work with you on campaign strategy, optimization, performance tracking, and reporting.";
  } else if (service.toLowerCase().includes("seo")) {
    serviceSpecificText = "Your account has been set up for SEO services. Our team will work with you on search visibility, keyword strategy, technical optimization, and organic growth.";
  } else if (service.toLowerCase().includes("social")) {
    serviceSpecificText = "Your account has been set up for Social Media Marketing. Our team will work with you on content strategy, social media management, engagement, and growth.";
  } else {
    serviceSpecificText = `Your account has been set up for ${service || "Digital Marketing"} services. Our team is excited to help you achieve your goals and drive meaningful results.`;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to BuzzSpire Media</title>
        <style>
          body { font-family: 'Outfit', 'Inter', -apple-system, sans-serif; background-color: #030712; color: #f3f4f6; margin: 0; padding: 0; }
          .wrapper { width: 100%; padding: 40px 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #0b0f19; border: 1px solid #1f2937; border-radius: 24px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
          h1 { color: #ffffff; margin-top: 0; font-size: 24px; font-weight: 700; }
          p { color: #9ca3af; line-height: 1.6; margin-bottom: 20px; }
          .details { background-color: #111827; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #1f2937; }
          .details p { margin: 5px 0; color: #e5e7eb; }
          .btn { display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #d946ef 100%); color: #ffffff !important; text-decoration: none; padding: 14px 28px; font-weight: 700; border-radius: 12px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <h1>Welcome to BuzzSpire Media</h1>
            <p>Hello ${name},</p>
            <p>Welcome to BuzzSpire Media. We are excited to work with you.</p>
            <p>Your account has been created successfully.</p>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #ffffff; margin-bottom: 10px; font-size: 16px;">Service:</h3>
              <p>${serviceSpecificText}</p>
            </div>
            
            <div class="details">
              <h3 style="color: #ffffff; margin-top: 0; margin-bottom: 15px; font-size: 16px;">Your Client Portal Login Details:</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Password:</strong> ${passwordText}</p>
              <p><strong>Client Portal:</strong> <a href="${loginUrl}" style="color: #a78bfa;">${loginUrl}</a></p>
            </div>
            
            <p>Please use these credentials to log in to your Client Portal. We strongly recommend keeping this email secure.</p>
            <a href="${loginUrl}" class="btn">Log in to Portal</a>
            
            <p style="margin-top: 40px; font-size: 14px;">Regards,<br><strong>BuzzSpire Media Team</strong></p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `Welcome to BuzzSpire Media

Hello ${name},

Welcome to BuzzSpire Media. We are excited to work with you.
Your account has been created successfully.

Service:
${serviceSpecificText}

Your Client Portal Login Details:

Email: ${email}
Password: ${passwordText}
Client Portal: ${loginUrl}

Please use these credentials to log in to your Client Portal.

Regards,
BuzzSpire Media Team`;

  const { data, error } = await getResendClient().emails.send({
    from: process.env.EMAIL_FROM || "BuzzSpire Sales <sales@buzzspiremedia.com>",
    to: email,
    subject: "Welcome to BuzzSpire Media",
    html: htmlContent,
    text: textContent,
  });

  console.log("Resend Data:", data);

  if (error) {
    console.error("Resend Error:", error);
    throw new Error(error.message);
  }
}


export async function sendLeadConfirmationEmail(lead: any) {
  const { name, company, service, email } = lead;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Thank you for contacting BuzzSpire</title>
        <style>
          body { font-family: 'Outfit', 'Inter', -apple-system, sans-serif; color: #1f2937; line-height: 1.6; background-color: #f9fafb; margin: 0; padding: 40px 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          h2 { color: #7c3aed; margin-top: 0; font-size: 24px; }
          .details { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .details ul { list-style: none; padding: 0; margin: 0; }
          .details li { margin-bottom: 10px; }
          .footer { margin-top: 30px; font-size: 14px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Thank you for contacting BuzzSpire Media</h2>
          <p>Hi ${name},</p>
          <p>We have received your enquiry regarding:</p>
          <p style="font-size: 18px; font-weight: bold; color: #111827;">${service}</p>
          <p>Our team has received your details and will get in touch with you shortly.</p>
          
          <div class="details">
            <p style="margin-top: 0; font-weight: bold;">Here are the details we received:</p>
            <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Company:</strong> ${company || "N/A"}</li>
              <li><strong>Service:</strong> ${service}</li>
            </ul>
          </div>
          
          <p>Thank you for choosing BuzzSpire Media.</p>
          <div class="footer">
            Regards,<br><strong>BuzzSpire Team</strong>
          </div>
        </div>
      </body>
    </html>
  `;

  const { data, error } = await getResendClient().emails.send({
    from: "BuzzSpire Sales <sales@buzzspiremedia.com>",
    to: email,
    subject: "Thank you for contacting BuzzSpire",
    html: htmlContent,
    text: `Hi ${name},\n\nThank you for contacting BuzzSpire Media.\n\nWe have received your enquiry regarding:\n${service}\n\nOur team has received your details and will get in touch with you shortly.\n\nHere are the details we received:\nName: ${name}\nCompany: ${company || "N/A"}\nService: ${service}\n\nThank you for choosing BuzzSpire Media.\n\nRegards,\nBuzzSpire Team`,
  });

  if (error) {
    console.error("Resend Confirmation Error:", error);
    throw new Error(error.message);
  }
  return data;
}

export async function sendLeadNotificationEmail(lead: any) {
  const adminEmail = process.env.LEADS_NOTIFICATION_EMAIL || "admin@buzzspire.com";
  let ownerVal = "N/A";
  if (lead.message && lead.message.includes("Owner:")) {
    ownerVal = lead.message.split("Owner:")[1].trim();
  }
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Chatbot Lead</title>
        <style>
          body { font-family: -apple-system, sans-serif; color: #1f2937; line-height: 1.6; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; }
          h2 { color: #d946ef; margin-top: 0; }
          .section { margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>New Chatbot Lead &mdash; ${lead.service}</h2>
          <p>New website chatbot lead received.</p>
          
          <div class="section">
            <p style="margin-top: 0; font-weight: bold;">Lead Details:</p>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li><strong>Name:</strong> ${lead.name}</li>
              <li><strong>Company:</strong> ${lead.company || "N/A"}</li>
              <li><strong>Service:</strong> ${lead.service}</li>
              <li><strong>Owner:</strong> ${ownerVal}</li>
              <li><strong>Phone:</strong> ${lead.phone || "N/A"}</li>
              <li><strong>Email:</strong> ${lead.email}</li>
              <li><strong>Source:</strong> ${lead.source}</li>
            </ul>
          </div>
          
          <div class="section">
            <p style="margin-top: 0; font-weight: bold;">Page:</p>
            <p style="margin: 0; word-break: break-all;">${lead.pageUrl || "N/A"}</p>
          </div>
          
          <div class="section">
            <p style="margin-top: 0; font-weight: bold;">Message:</p>
            <p style="margin: 0;">${lead.message}</p>
          </div>
          
          <p>Please check: <strong>Admin &rarr; Leads</strong></p>
        </div>
      </body>
    </html>
  `;

  const { data, error } = await getResendClient().emails.send({
    from: "BuzzSpire Sales <sales@buzzspiremedia.com>",
    to: adminEmail,
    subject: `New Chatbot Lead — ${lead.service}`,
    html: htmlContent,
    text: `New website chatbot lead received.\n\nLead Details:\nName: ${lead.name}\nCompany: ${lead.company || "N/A"}\nService: ${lead.service}\nOwner: ${ownerVal}\nPhone: ${lead.phone || "N/A"}\nEmail: ${lead.email}\nSource: ${lead.source}\n\nPage:\n${lead.pageUrl || "N/A"}\n\nMessage:\n${lead.message}\n\nPlease check: Admin -> Leads`,
  });

  if (error) {
    console.error("Resend Notification Error:", error);
    throw new Error(error.message);
  }
  return data;
}
