async function runScheduler() {
  console.log("Scheduler started. Pinging /api/cron/publish-scheduled-blogs every 60 seconds...");
  
  setInterval(async () => {
    try {
      const PORT = process.env.PORT || "3000";
      const headers: Record<string, string> = {};
      if (process.env.CRON_SECRET) {
        headers["Authorization"] = `Bearer ${process.env.CRON_SECRET}`;
      }
      const res = await fetch(`http://localhost:${PORT}/api/cron/publish-scheduled-blogs`, { headers });
      if (res.ok) {
        const data = (await res.json()) as { message?: string };
        if (data.message && data.message !== "No blogs to publish") {
          console.log(`[Scheduler] ${new Date().toISOString()} - ${data.message}`);
        }
      } else {
        console.error(`[Scheduler] Error: HTTP ${res.status}`);
      }
    } catch (e) {
      console.error(`[Scheduler] Network error pinging cron route:`, e);
    }
  }, 60 * 1000);
}

runScheduler();
