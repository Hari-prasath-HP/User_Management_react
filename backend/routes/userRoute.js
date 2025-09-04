const express = require('express')
const router = express.Router()
const User = require("../models/User")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

router.get("/",authMiddleware,adminMiddleware, async(req,res)=>{
    const users = await User.find().select("-password -refreshToken")
    res.json(users)
})

router.get("/:id",authMiddleware, async(req,res)=>{
    const user = await User.findById(req.params.id).select("-password -refreshToken")
    res.json(user)
})

router.put("/:id",authMiddleware, async(req,res)=>{
    const {name,email,phone,role} = req.body
    if(req.user.id !== req.params.id && req.user.role!=="admin"){
        return res.status(403).json({ msg: "Not authorized" });
    }
    const user = await User.findByIdAndUpdate(req.params.id,{name,email,phone,role},{new:true})
    res.json(user)
})

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted successfully" });
});

module.exports = router