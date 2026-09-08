const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { role: 'EMPLOYEE' } });
  if (!user) return console.log('No employee found');

  const lead = await prisma.lead.findFirst({ where: { assignedEmployeeId: user.id } });
  if (!lead) return console.log('No lead assigned to employee found');

  console.log('Testing with User:', user.email, 'Lead:', lead.id);

  try {
    const reminder = await prisma.leadReminder.create({
      data: {
        title: "Test",
        note: "Test note",
        dueDate: new Date("2026-09-03T15:36:00.000Z"),
        leadId: lead.id,
        employeeId: user.id,
        status: "PENDING",
      }
    });
    console.log("Success:", reminder.id);
  } catch (e) {
    console.error("Prisma error:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
