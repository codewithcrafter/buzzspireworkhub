import { prisma } from './src/lib/prisma';

async function main() {
  try {
    // Check if CloudFile exists
    const cloudFileResult = await prisma.$queryRawUnsafe(`SELECT EXISTS (
        SELECT FROM 
            information_schema.tables 
        WHERE 
            table_schema = 'public' AND 
            table_name   = 'CloudFile'
        );`);
    console.log('CloudFile exists:', cloudFileResult);

    const employeeResult = await prisma.$queryRawUnsafe(`SELECT EXISTS (
        SELECT FROM 
            information_schema.tables 
        WHERE 
            table_schema = 'public' AND 
            table_name   = 'Employee'
        );`);
    console.log('Employee exists:', employeeResult);

    const cmsResult = await prisma.$queryRawUnsafe(`SELECT EXISTS (
        SELECT FROM 
            information_schema.tables 
        WHERE 
            table_schema = 'public' AND 
            table_name   = 'Page'
        );`);
    console.log('Page exists:', cmsResult);

    const migrationResult = await prisma.$queryRawUnsafe(`SELECT * FROM _prisma_migrations;`);
    console.log('Prisma Migrations:', migrationResult);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
