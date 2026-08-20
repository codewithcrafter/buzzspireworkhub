import { prisma } from "../src/lib/prisma";
import { config } from "dotenv";
config();

async function seed() {
  const systemPages = [
    {
      title: "Homepage",
      slug: "home",
      status: "PUBLISHED" as const,
      seoTitle: "BuzzSpire Media - Digital Marketing Agency in Delhi",
      metaDescription: "We report results, not just activity.",
      publishedContent: [
        { sectionType: "HomeHero", order: 0, isEnabled: true, content: {} },
        { sectionType: "HomeTrust", order: 1, isEnabled: true, content: {} },
        { sectionType: "HomeResults", order: 2, isEnabled: true, content: {} },
        { sectionType: "HomeWhyChoose", order: 3, isEnabled: true, content: {} },
        { sectionType: "HomeServices", order: 4, isEnabled: true, content: {} },
        { sectionType: "HomeProcess", order: 5, isEnabled: true, content: {} },
        { sectionType: "HomeCaseStudies", order: 6, isEnabled: true, content: {} },
        { sectionType: "HomeInsights", order: 7, isEnabled: true, content: {} },
        { sectionType: "HomeTestimonials", order: 8, isEnabled: true, content: {} },
        { sectionType: "HomeFAQ", order: 9, isEnabled: true, content: {} },
        { sectionType: "HomeCTA", order: 10, isEnabled: true, content: {} }
      ]
    },
    {
      title: "About Us",
      slug: "about",
      status: "PUBLISHED" as const,
      seoTitle: "About Us | BuzzSpire Media",
      metaDescription: "Learn about BuzzSpire Media.",
      publishedContent: [
        { sectionType: "AboutHero", order: 0, isEnabled: true, content: {} },
        { sectionType: "AboutStats", order: 1, isEnabled: true, content: {} },
        { sectionType: "AboutStory", order: 2, isEnabled: true, content: {} },
        { sectionType: "AboutTimeline", order: 3, isEnabled: true, content: {} },
        { sectionType: "AboutFounder", order: 4, isEnabled: true, content: {} },
        { sectionType: "AboutTeam", order: 5, isEnabled: true, content: {} },
        { sectionType: "AboutTech", order: 6, isEnabled: true, content: {} },
        { sectionType: "AboutCTA", order: 7, isEnabled: true, content: {} }
      ]
    }
  ];

  for (const page of systemPages) {
    const existing = await prisma.page.findUnique({ where: { slug: page.slug } });
    if (!existing) {
      const created = await prisma.page.create({
        data: {
          title: page.title,
          slug: page.slug,
          status: page.status,
          seoTitle: page.seoTitle,
          metaDescription: page.metaDescription,
          publishedContent: page.publishedContent,
          publishedAt: new Date()
        }
      });
      console.log(`Created ${page.slug} page`);
      
      for (const sec of page.publishedContent) {
        await prisma.pageSection.create({
          data: {
            pageId: created.id,
            sectionType: sec.sectionType,
            order: sec.order,
            isEnabled: sec.isEnabled,
            content: sec.content
          }
        });
      }
    } else {
      console.log(`${page.slug} page already exists`);
    }
  }
}

seed().catch(console.error).finally(() => prisma.$disconnect());
