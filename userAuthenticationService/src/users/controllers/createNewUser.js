const userService = require("../services/createNewUser");

const createNewUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        const passRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
        if (!passRegex.test(password)) {
            return res.status(400).json({ error: 'password should contain atleast one special char,one number,one uppercase letter,one lowercase letter' });
        }
        const nameRegex = /^[a-zA-Z]{3,}$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({ error: 'only alphabets allowed of atleast of length 3' });
        }

        await userService.createNewUser(req, res);
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ error: error });
    }
};

module.exports = {
    createNewUser
}