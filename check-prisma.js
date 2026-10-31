const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const startOfDay = new Date(Date.UTC(2026, 8, 15, 18, 30, 0, 0)); // Midnight 2026-09-16 IST
    const endOfDay = new Date(Date.UTC(2026, 8, 16, 18, 29, 59, 999));
    
    console.log("Date bounds:", startOfDay.toISOString(), endOfDay.toISOString());

    const att16 = await prisma.attendance.findMany({
        where: {
            date: {
                gte: startOfDay,
                lte: endOfDay
            }
        },
        include: { employee: true, sessions: true }
    });
    console.log("Att 2026-09-16 Count:", att16.length);
    for (const a of att16) {
        console.log(`Emp: ${a.employeeId}, Status: ${a.status}`);
    }

    // Now check what Dashboard would see:
    const today = new Date();
    // format as YYYY-MM-DD in IST
    const kolkataStr = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric", month: "2-digit", day: "2-digit"
    }).format(today);
    console.log("Today Kolkata String:", kolkataStr);

    const [y, m, d] = kolkataStr.split('-').map(Number);
    const sToday = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
    const startOfToday = new Date(sToday.getTime() - 19800000);
    const endOfToday = new Date(startOfToday.getTime() + 24 * 3600 * 1000 - 1);

    console.log("Today bounds:", startOfToday.toISOString(), endOfToday.toISOString());

    const attToday = await prisma.attendance.findMany({
        where: { date: { gte: startOfToday, lte: endOfToday } },
        include: { employee: true, sessions: true }
    });
    console.log("Att Today Count:", attToday.length);
    for (const a of attToday) {
        console.log(`Emp: ${a.employeeId}, Status: ${a.status}`);
    }

    await prisma.$disconnect();
}
check().catch(console.error);
