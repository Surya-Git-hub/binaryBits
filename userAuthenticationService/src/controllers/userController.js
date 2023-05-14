const userService = require("../services/userService");

const getAllUsers = (req, res) => {
    const allusers = userService.getAllusers();
    res.send({ status: "OK", data: allusers });
};

// const getOneUser = (req, res) => {
//     const user = userService.getOneuser();
//     res.send("Get an existing user");
// };

const createNewUser = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }
    const newUser = { name, email, password };
    const createdUser = userService.createNewUser(newUser);
    res.status(201).send({ status: "OK", data: createdUser });
};

// const updateOneuser = (req, res) => {
//     const updateduser = userService.updateOneuser();
//     res.send("Update an existing user");
// };

// const deleteOneuser = (req, res) => {
//     userService.deleteOneuser();
//     res.send("Delete an existing user");
// };

module.exports = {
    getAllUsers,
    // getOneuser,
    createNewUser,
    // updateOneuser,
    // deleteOneuser,
};