import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("=== EMPLOYEES ===");
        const employees = await prisma.employee.findMany();
        console.log(`Total Employees: ${employees.length}`);
        
        console.log("\n=== ATTENDANCES for 2026-09-16 ===");
        const att16 = await prisma.attendance.findMany({
            where: {
                date: {
                    gte: new Date("2026-09-15T18:30:00.000Z"),
                    lte: new Date("2026-09-16T18:29:59.999Z")
                }
            },
            include: { employee: true }
        });
        
        console.log(`Total Attendances on Sept 16: ${att16.length}`);
        for (const att of att16) {
            console.log(`Emp: ${att.employee.fullName}, Status: ${att.status}, CheckIn: ${att.checkIn}, Date: ${att.date}`);
        }

        console.log("\n=== ATTENDANCES for 2026-10-01 (TODAY) ===");
        const attToday = await prisma.attendance.findMany({
            where: {
                date: {
                    gte: new Date("2026-09-30T18:30:00.000Z"),
                    lte: new Date("2026-10-01T18:29:59.999Z")
                }
            },
            include: { employee: true }
        });

        console.log(`Total Attendances on Oct 1 (Today): ${attToday.length}`);
        for (const att of attToday) {
            console.log(`Emp: ${att.employee.fullName}, Status: ${att.status}, CheckIn: ${att.checkIn}, Date: ${att.date}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
