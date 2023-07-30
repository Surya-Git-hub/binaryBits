const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkDuplicateEmail(email) {
  const user = await prisma.User.findUnique({
    where: {
      email: email,
      emailVerified: true,
    },
  });
    return user;
}

module.exports = { checkDuplicateEmail };