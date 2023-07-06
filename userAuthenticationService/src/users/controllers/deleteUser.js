const userService = require("../services/userService");

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
};

module.exports = {
  deleteUser,
};
