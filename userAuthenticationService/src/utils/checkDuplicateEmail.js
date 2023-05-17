const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkDuplicateEmail(email) {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user !== null;
  }

  module.exports = {checkDuplicateEmail};