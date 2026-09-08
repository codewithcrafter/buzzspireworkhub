import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    console.log("Running query...");
    const pageRecord = await prisma.page.findUnique({
      where: { slug: "career" },
    });
    console.log("Success:", pageRecord);
  } catch (error) {
    console.error("Error occurred:");
    console.error(error);
  } finally {
    console.log("Done.");
    process.exit(0);
  }
}

main();
