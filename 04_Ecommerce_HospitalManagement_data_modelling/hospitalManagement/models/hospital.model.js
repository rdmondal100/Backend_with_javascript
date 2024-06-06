import mongoose, { mongo } from "mongoose"

const hospitalSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,

  },
  addressLIne1:{
    type: String,
    required: true,

  },
  addressLIne2:{
    type: String,

  },
  city:{
    type: String,
    required: true,

  },
  pincode:{
    type: String,
    required: true,

  },
  specializedIN:[
    {
      type: String,
      
    }
  ],

  
},{timestamps:true})


export const Hospital = mongoose.model("Hospital",hospitalSchema)