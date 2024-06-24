import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req,_,next)=>{
  try {
    const token = req.cookies?.accessToken || req.header("Authorzation"?.replace("Bearer",""))
  
  if(!token){
    throw new apiError(401,"Unauthorised token")
  }
  
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
    const user =  await User.findById(decodedToken?._id).select("-password -refreshToken")
  
    if(!user){
      throw new apiError(401, "invalid access Token")
    }
  
    req.user = user
    next()
  } catch (error) {
      throw new apiError(401,error?.message || "Invalid acess token")
  }

})
