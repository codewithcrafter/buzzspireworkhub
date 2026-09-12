async function main() {
  console.log("=== VERIFYING PUBLIC BLOG LISTING & DETAIL AFTER CLEANUP ===");

  const listRes = await fetch("http://localhost:3000/api/blogs");
  console.log(`GET /api/blogs -> HTTP ${listRes.status}`);
  const listData = await listRes.json();
  console.log(`Public listing blog count: ${listData.blogs?.length}`);

  const detailRes = await fetch("http://localhost:3000/api/blogs/best-lead-generation-agency-in-gurgaon");
  console.log(`GET /api/blogs/best-lead-generation-agency-in-gurgaon -> HTTP ${detailRes.status}`);
  if (detailRes.ok) {
    const detailData = await detailRes.json();
    console.log(`Detail title: "${detailData.title}"`);
    console.log(`Detail status: "${detailData.status}"`);
    console.log(`Detail author: "${detailData.author}"`);
    console.log(`Detail FAQs count: ${detailData.faqs?.length}`);
  }
}

main().catch(console.error);
