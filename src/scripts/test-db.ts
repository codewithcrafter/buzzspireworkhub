import { prisma } from "../lib/prisma";

async function main() {
  try {
    console.log("DATABASE_URL IS:", process.env.DATABASE_URL ? "SET (HIDDEN)" : "NOT SET");
    console.log("Checking Employee table...");
    const result = await prisma.employee.findFirst();
    console.log("Success! Found:", result ? result.email : "none");
  } catch (error: any) {
    console.error("PRISMA ERROR CODE:", error.code);
    console.error("MESSAGE:", error.message);
    if (error.meta) {
      console.error("META:", error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
