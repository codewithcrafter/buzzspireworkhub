const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const cloudFileResult = await prisma.$queryRawUnsafe(`SELECT EXISTS (
        SELECT FROM 
            information_schema.tables 
        WHERE 
            table_schema = 'public' AND 
            table_name   = 'CloudFile'
        );`);
    console.log('CloudFile exists:', cloudFileResult);

    const migrationResult = await prisma.$queryRawUnsafe(`SELECT * FROM _prisma_migrations;`);
    console.log('Prisma Migrations:', migrationResult);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
