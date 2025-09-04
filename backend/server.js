const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/authRoute")
const userRoutes = require("./routes/userRoute")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("Mongodb is connected"))
    .catch((arr)=>console.log(err))

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on the port ${process.env.PORT}`)
})