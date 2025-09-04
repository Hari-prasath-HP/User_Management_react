const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
    getUsers,
    getProfile,
    updateUser,
    deleteUser,
    updateProfileImage
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

router.get("/", authMiddleware, adminMiddleware, getUsers);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile/image", authMiddleware, upload.single("profileImage"), updateProfileImage);
router.put("/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
