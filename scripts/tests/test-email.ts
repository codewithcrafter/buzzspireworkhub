import { sendClientWelcomeEmail } from "./src/services/email.service";

async function run() {
    try {
        await sendClientWelcomeEmail("gulshankrs2111@gmail.com", "Test User", "password123", "SEO");
        console.log("Success");
    } catch (e) {
        console.error("Caught Error:", e);
    }
}

run();
