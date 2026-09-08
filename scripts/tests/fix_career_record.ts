import { prisma } from "./src/lib/prisma";

async function fixCareerPage() {
  try {
    const existing = await prisma.page.findUnique({
      where: { slug: "career" }
    });

    if (!existing) {
      console.log("Creating missing career page record...");
      await prisma.page.create({
        data: {
          title: "Careers",
          slug: "career",
          status: "PUBLISHED",
          seoTitle: "Careers & Open Roles | BuzzSpire Media",
          metaDescription: "Join BuzzSpire Media's team. Open positions for Senior Front-End Engineers, Performance Media Buyers, and B2B Copywriters with performance dividends.",
          publishedContent: {
            keywords: "careers, jobs, agency jobs, digital marketing jobs"
          }
        }
      });
      console.log("Career page record created successfully.");
    } else {
      console.log("Career page record already exists.");
    }
  } catch (error) {
    console.error("Error creating career page:", error);
  } finally {
    process.exit(0);
  }
}

fixCareerPage();
