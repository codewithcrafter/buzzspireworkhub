require('@next/env').loadEnvConfig(process.cwd());
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const records = await prisma.caseStudy.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      isDemo: true,
      heroMetric: true,
      execution: true,
      results: true,
      testimonial: true,
    }
  });
  console.log("TOTAL_RECORDS:", records.length);
  console.log(JSON.stringify(records, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
