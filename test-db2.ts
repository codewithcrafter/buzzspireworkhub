import "dotenv/config";
import { prisma } from './src/lib/prisma';
prisma.page.findUnique({ where: { slug: 'contact' } })
  .then(console.log)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
