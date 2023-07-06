const userService = require("../services/getAllUsers");

const getAllUsers = async (req, res) => {
  try {
    const allusers = await userService.getAllUsers();
    return res.status(200).json({ status: "OK", data: allusers });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
};

module.exports = {
    getAllUsers
}