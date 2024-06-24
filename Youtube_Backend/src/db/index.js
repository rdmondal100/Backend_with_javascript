import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
import dotenv from 'dotenv';
dotenv.config({path:'./.env'})


const connectDb = async () => {
  console.log("Mongodb uri: ", process.env.MONGODB_URI)
  console.log( DB_NAME)

  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`/n MongoDb connected !! DB HOST: ${connectionInstance}`)

  } catch (error) {

    console.log("MONGODB connection error : ", error);
    process.exit(1)

  }
}

export default connectDb