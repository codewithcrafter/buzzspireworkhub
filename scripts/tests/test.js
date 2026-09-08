const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$connect()
  .then(() => console.log('connected successfully'))
  .catch((e) => console.error('Connection error:', e.message))
  .finally(() => prisma.$disconnect());
