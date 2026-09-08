import { Resend } from "resend";

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing or undefined.");
  }
  return new Resend(apiKey);
};

async function run() {
    try {
        const { data, error } = await getResendClient().emails.send({
            from: process.env.EMAIL_FROM || "BuzzSpire Sales <sales@buzzspiremedia.com>",
            to: "gulshankrs2111@gmail.com",
            subject: "Test from buzzspiremedia.com",
            html: "<p>Test</p>",
            text: "Test"
        });
        console.log("Error:", error);
        console.log("Data:", data);
    } catch (e) {
        console.error("Caught Error:", e);
    }
}

run();
