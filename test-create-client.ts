import { createClientWithPassword } from "./src/services/user.service";

async function run() {
    try {
        const result = await createClientWithPassword(
            "Test Client",
            "gulshankrs2111+2@gmail.com",
            "password123",
            "Test Company",
            "1234567890",
            "SEO",
            0,
            0,
            "Test Project",
            "",
            "",
            "PLANNING",
            0
        );
        console.log("Result:", result);
    } catch (e) {
        console.error("Caught Error:", e);
    }
}

run();
