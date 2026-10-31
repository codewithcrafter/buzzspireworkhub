const http = require('http');

http.get('http://localhost:3000/api/admin/live-attendance?date=2026-09-16', {
  headers: {
    // We need to bypass auth or pass auth.
    // Actually the easiest way to inspect is to write a script that queries Prisma directly, since it doesn't need auth.
  }
});
