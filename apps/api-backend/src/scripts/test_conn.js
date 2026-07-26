const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('PostgreSQL Connection SUCCESS!');
    const count = await prisma.company.count();
    console.log('Company count:', count);
  } catch (err) {
    console.error('PostgreSQL Connection FAILED:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
