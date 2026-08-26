const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const mockNames = ["Aria Mercer", "John Doe", "David Miller", "Sarah Jenkins", "Tony Stark", "Arthur Dent"];
    
    console.log("Looking for mock clients...");
    const clients = await prisma.user.findMany({
        where: { role: 'CLIENT' }
    });

    let deleted = 0;
    for (const client of clients) {
        if (mockNames.includes(client.name) || client.email.includes('vercel.com') || client.email.includes('acme.com')) {
            console.log(`Deleting mock client: ${client.name} (${client.email})`);
            await prisma.user.delete({ where: { id: client.id } });
            deleted++;
        }
    }
    console.log(`Finished deleting ${deleted} mock clients.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
