const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAll = async () => {
  try {
    const allusers = await prisma.User.findMany();
    console.log(allusers);
    return allusers;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const getOne = async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await prisma.User.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    } else {
      return res.status(200).json({
        message: "user details",
        success: true,
        user: {
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          profile: user.profile,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const getSome = async (req, res) => {
  try {
    const ids = req.query?.userIds;
    const userIds = ids.split(",");
    if (userIds.length <= 0) {
      return res.status(400).json({ error: "userIds are required in query" });
    }
    let users = await prisma.User.findMany({
      select: { name: true, email: true, emailVerified: true, profile: true },
      where: {
        id: { in: userIds },
      },
    });
    if (!users) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    return res.status(200).json({
      message: "found users",
      success: true,
      users: [...users],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const updateOne = async (req, res) => {
  try {
    const { name, email, id, level } = req.body;
    let updatedUser;
    if (level == 2) {
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          email: email,
          emailVerified: false,
        },
      });
    } else if (level == 1) {
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          email: email,
          emailVerified: false,
        },
      });
    } else if (level == 0) {
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: name,
        },
      });
    } else {
      return res.status(400).json({ error: "invalid update level" });
    }
    return res.status(200).json({
      message: "user updated",
      success: true,
      users: [updatedUser],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const updateSome = async (req, res) => {
  try {
    const { name, email, ids, level } = req.body;
    if (ids.length <= 0) {
      return res.status(400).json({ error: "ids are required in body" });
    }
    let updatedUser;
    if (level == 2) {
      updatedUser = await prisma.user.updateMany({
        where: {
          id: { in: ids },
        },
        data: {
          name: name,
          email: email,
          emailVerified: false,
        },
      });
    } else if (level == 1) {
      updatedUser = await prisma.user.updateMany({
        where: {
          id: { in: ids },
        },
        data: {
          email: email,
          emailVerified: false,
        },
      });
    } else if (level == 0) {
      updatedUser = await prisma.user.updateMany({
        where: {
          id: { in: ids },
        },
        data: {
          name: name,
        },
      });
    } else {
      return res.status(400).json({ error: "invalid update level" });
    }
    return res.status(200).json({
      message: "user updated",
      success: true,
      users: [updatedUser],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const updateAll = async (req, res) => {
  try {
    const { name, email, level } = req.body;
    let updatedUser;
    if (level == 2) {
      updatedUser = await prisma.user.updateMany({
        data: {
          name: name,
          email: email,
          emailVerified: false,
        },
      });
    } else if (level == 1) {
      updatedUser = await prisma.user.updateMany({
        data: {
          email: email,
          emailVerified: false,
        },
      });
    } else if (level == 0) {
      updatedUser = await prisma.user.updateMany({
        data: {
          name: name,
        },
      });
    } else {
      return res.status(400).json({ error: "invalid update level" });
    }
    return res.status(200).json({
      message: "user updated",
      success: true,
      users: [updatedUser],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const deleteOne = async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    } else {
      return res.status(200).json({
        message: "user deleted",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const deleteSome = async (req, res) => {
  try {
    const ids = req.query?.userIds;
    const userIds = ids.split(",");
    if (userIds.length <= 0) {
      return res.status(400).json({ error: "userIds are required in query" });
    }
    let users = await prisma.user.deleteMany({
      where: {
        id: { in: userIds },
      },
    });
    if (!users) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    return res.status(200).json({
      message: "deleted users",
      success: true,
      users: [users],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const deleteAll = async (req, res) => {
  try {
    let users = await prisma.user.deleteMany()
    return res.status(200).json({
      message: "deleted all users",
      success: true,
      users: [users],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};


module.exports = {
  getAll,
  getOne,
  getSome,
  updateOne,
  updateSome,
  updateAll,
  deleteOne,
  deleteSome,
  deleteAll,
};
