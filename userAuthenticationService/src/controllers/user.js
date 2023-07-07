const userService = require("../services/user");
const {
  isEmailValid,
  isPassValid,
  isNameValid,
  hasValue,
} = require("../helpers");

const getOne = async (req, res) => {
  try {
    const id = req.params?.userId;
    if (!hasValue(id)) {
      return res.status(400).json({ error: "userId is required in params" });
    }
    await userService.getOne(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const getSome = async (req, res) => {
  try {
    const ids = req.query?.userIds;
    if (!hasValue(ids)) {
      return res.status(400).json({ error: "userIds are required in query" });
    }
    await userService.getSome(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const getAll = async (req, res) => {
  try {
    const allusers = await userService.getAll();
    return res.status(200).json({ status: "OK", data: allusers });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
};

const updateOne = async (req, res) => {
  try {
    const { name, email, id, level } = req.body;
    if (!hasValue(id)) {
      return res.status(400).json({ error: "id is required in body" });
    }
    if (!hasValue(level)) {
      return res.status(400).json({ error: "level is required in body" });
    }
    if (!hasValue(name) && !hasValue(email)) {
      return res
        .status(400)
        .json({ error: "something is required update something" });
    }
    await userService.updateOne(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const updateAll = async (req, res) => {
  try {
    const { name, email, level } = req.body;
    if (!hasValue(name) && !hasValue(email) && !hasValue(password)) {
      return res
        .status(400)
        .json({ error: "something is required update something" });
    }
    if (!hasValue(level)) {
      return res.status(400).json({ error: "level is required in body" });
    }
    await userService.updateAll(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const updateSome = async (req, res) => {
  try {
    const { name, email, ids, level } = req.body;
    if (!hasValue(ids)) {
      return res.status(400).json({ error: "ids are required in body" });
    }
    if (!hasValue(name) && !hasValue(email)) {
      return res
        .status(400)
        .json({ error: "something is required update something" });
    }
    if (!hasValue(level)) {
      return res.status(400).json({ error: "level is required in body" });
    }
    await userService.updateSome(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const deleteOne = async (req, res) => {
  try {
    const id = req.params?.userId;
    if (!hasValue(id)) {
      return res.status(400).json({ error: "userId is required in params" });
    }
    await userService.deleteOne(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const deleteSome = async (req, res) => {
  try {
    const ids = req.query?.userIds;
    if (!hasValue(ids)) {
      return res.status(400).json({ error: "userIds are required in query" });
    }
    await userService.deleteSome(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const deleteAll = async (req, res) => {
  try {
    await userService.deleteAll(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
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
