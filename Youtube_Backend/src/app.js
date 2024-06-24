import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import dotenv from 'dotenv';
dotenv.config({path:'./.env'})

const app = express()

console.log("origin:",process.env.CORS_ORIGIN)

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
app.use ( express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes
import userRouter from './routes/user.route.js'



//routes declaration

app.use("/api/v1/users",userRouter)


export {app}