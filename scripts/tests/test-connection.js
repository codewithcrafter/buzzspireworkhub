const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  console.log("Testing connection...");
  try {
    await prisma.$connect();
    console.log("Connection successful!");
    const count = await prisma.user.count();
    console.log("User count:", count);
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
