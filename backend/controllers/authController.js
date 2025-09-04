const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const generateAccessToken = (user) =>{
    return jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"15m"})
}

const generateRefershToken = (user) =>{
    return jwt.sign({id:user._id,role:user.role},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"})
}

exports.register = async(req,res) =>{
    try{
        const {name,email, phone, password} = req.body
        const existingUser = await User.find({email})
        if(existingUser) return res.status(400).json({msg:"Email already exists"})
        
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({name,email,phone,password:hashedPassword})
        res.status(201).json({msg:"User registered successfully",user})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.login = async (req,res) =>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({msg:"User not found"})
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(400).json({msg:"Invalid Password"})
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefershToken(user)
        user.refreshToken = refreshToken
        await user.save()

        res.json({
            accessToken,
            refreshToken,
            user:{id:user._id,name:user.name,role:user.role}
        })
    }catch (err){
        res.status(500).json({error:err.message})
    }
}

exports.refreshToken = async (req,res) =>{
    try{
        const {token} = req.body
        if (!token) return res.status(401).json({ msg: "No token provided" });
        const user = await user.findOne({refreshToken:token})
        if(!user) return res.status(403).json({msg:"Invalid refresh Token"})
        jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,(err,decoded)=>{
            if(err) return res.status(403).json({msg:'Token expired or Invalid'})
            const newAccesstoken = generateAccessToken(user)
            res.json({accessToken:newAccesstoken})
        })
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.logout = async (req,res) =>{
    try{
        const {token} = req.body
        const user = await User.findOne({refreshToken:token})
        if(user){
            user.refreshToken = null
            await user.save()
        }
        res.json({msg:"Logged out successfully"})
    }catch (err){
        res.status(500).json({error:err.message})
    }
}