const { PrismaClient } = require('@prisma/client');


async function connectToDb() {
  const prisma = new PrismaClient();
  await prisma.$connect();
  console.log("db connected")
  return prisma;
}

module.exports = {
  connectToDb
}