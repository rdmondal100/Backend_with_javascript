// require('dotenv').config({path: './.env'})
import dotenv from 'dotenv';
dotenv.config({path:'./.env'})

import connectDb from './db/index.js';
import { app } from './app.js';


connectDb()
.then(()=>{

  
  app.on("error",(error)=>{
    console.log("Error: ",error)
    throw error
  })

  app.listen(process.env.PORT || 5000, ()=>{
    console.log(`http://localhost:${process.env.PORT}`)
  })


})
.catch((error)=>{
  console.log("MONGO db connection failed !! ",error)
})




/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";


import express from "express"
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

    app.on("error",(error)=>{
      console.log("Error: ",error)
      throw error;
    })

    app.listen(process.env.PORD,()=>{
      console.log(`http://localhost:${process.env.PORT}`)
    })
  } catch (error) {
    console.log("Error: ", error);
    throw error
  }
})()
*/