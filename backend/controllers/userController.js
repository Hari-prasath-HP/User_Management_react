const User = require("../models/User");

// Get all users (admin)
const getUsers = async (req, res) => {
    const users = await User.find().select("-password");
    res.json({ count: users.length, users });
};

// Get user profile
const getProfile = async (req, res) => {
    res.json(req.user);
};

// Update user (admin)
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.role) user.role = req.body.role;

  await user.save();
  res.json(user);
};

// Delete user (admin)
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.remove();
    res.json({ message: "User removed" });
};

// Update profile image
const updateProfileImage = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const user = await User.findById(req.user._id);
    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();
    res.json(user);
};

module.exports = { getUsers, getProfile, updateUser, deleteUser, updateProfileImage };
