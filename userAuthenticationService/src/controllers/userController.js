const userService = require("../services/userService");
const { checkVerificationLink } = require("../utils/checkVerificationLink");

const getAllUsers = async (req, res) => {
    try {
        const allusers = await userService.getAllUsers();
        res.send({ status: "OK", data: allusers });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error });
    }
};

// const getOneUser = (req, res) => {
//     const user = userService.getOneuser();
//     res.send("Get an existing user");
// };

const createNewUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: 'Name, email and password are required' });
        }
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email' });
        }
        const passRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
        if (!passRegex.test(password)) {
            res.status(400).json({ error: 'password should contain atleast one special char,one number,one uppercase letter,one lowercase letter' });
        }
        const nameRegex = /^[a-zA-Z]{3,}$/;
        if (!nameRegex.test(name)) {
            res.status(400).json({ error: 'only alphabets allowed of atleast of length 3' });
        }

        await userService.createNewUser(req, res);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'email and password are required' });
        }
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email' });
        }
        const passRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
        if (!passRegex.test(password)) {
            res.status(400).json({ error: 'password should contain atleast one special char,one number,one uppercase letter,one lowercase letter' });
        }
        await userService.userLogin(req, res);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error });
    }
}

const verifyEmail = async (req, res) => {
    try {
        const token = req.query.token;
        if (!token) {
            res.status(400).json({ error: 'token is invalid or not found' });
        }
        const result = await checkVerificationLink(token);
        if (!result.match) {
            res.status(400).json({ error: 'token not matched' });
        }
        await userService.verifyEmail(req, res, result);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error });
    }
}

const reVerifyEmail = async(req,res)=>{
    try {
        await userService.reVerifyEmail(req,res);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
        
    }
}

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
    userLogin,
    verifyEmail,
    reVerifyEmail,
    // updateOneuser,
    // deleteOneuser,
};