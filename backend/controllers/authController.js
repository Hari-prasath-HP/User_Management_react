const User = require("../models/User");
const { generateToken, generateRefreshToken } = require("../utils/generateToken");

// Register user
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password, role });

        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(201).json({ token, refreshToken, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({ token, refreshToken, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { registerUser, loginUser };
