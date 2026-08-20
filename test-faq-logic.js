const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

// We need to simulate the backend merge logic
const CMS_CONFIG = {
  home: {
    defaultFaqs: [
      { q: "Original 1", a: "Answer 1" },
      { q: "Original 2", a: "Answer 2" }
    ]
  }
};

function getCmsConfig(slug) {
  return CMS_CONFIG[slug] || {};
}

async function simulate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Fetching home page from DB...");
  const page = await prisma.page.findUnique({ where: { slug: 'home' } });
  
  if (!page) {
    console.log("No home page found!");
    process.exit(1);
  }

  console.log("Original DB content:", JSON.stringify(page.publishedContent));

  // Simulating API GET
  const conf = getCmsConfig(page.slug);
  if (conf.defaultFaqs) {
    const content = page.publishedContent || {};
    
    if (!content._faqsSeeded) {
      console.log("Merging defaults...");
      const existingFaqs = Array.isArray(content.faqs) ? content.faqs : [];
      const existingQs = new Set(existingFaqs.map((f) => f.q));
      
      const combinedFaqs = [
        ...conf.defaultFaqs.filter(df => !existingQs.has(df.q)),
        ...existingFaqs
      ];
      
      content.faqs = combinedFaqs;
      content._faqsSeeded = true;
      page.publishedContent = content;
    } else {
      console.log("Already seeded!");
    }
  }

  console.log("API returns to frontend:", JSON.stringify(page.publishedContent));
  
  // Frontend user adds a FAQ
  const frontendState = JSON.parse(JSON.stringify(page.publishedContent));
  frontendState.faqs.push({ q: "New Test FAQ", a: "Admin added this." });
  
  console.log("Frontend sends to PUT /sections:", JSON.stringify(frontendState));
  
  // Backend PUT /sections saves it to DB
  await prisma.page.update({
    where: { id: page.id },
    data: { publishedContent: frontendState }
  });
  console.log("Saved to DB!");
  
  // Verify what's in DB
  const finalPage = await prisma.page.findUnique({ where: { slug: 'home' } });
  console.log("Final DB content:", JSON.stringify(finalPage.publishedContent));
  
  await prisma.$disconnect();
  await pool.end();
}

simulate();
