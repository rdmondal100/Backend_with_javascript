import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";


const registerUser = asyncHandler(async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Uploaded files:", req.files);

  //get user details from frontend
  const { fullName, email, username, password } = req.body




  //validated the details according to the model
  if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required")
  }


  //check if the user is already  esists : username, email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedUser) {
    throw new apiError(409, "User with email or username aleady exists")
  }



  // check for images, check for avater
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log("avatar local path:", avatarLocalPath)
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path
  console.log(avatarLocalPath)
  if (!avatarLocalPath) {
    throw new apiError(400, "Avater is required")
  }


  //upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  console.log("Avatar: ", avatar)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if (!avatar) {
    throw new apiError(400, " Avatar file is required")
  }



  //create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username?.toLowerCase()
  })

  console.log("User name is ", username)
  console.log("User name is ", username?.toLowerCase())



  //remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )




  // check for user creation
  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user")
  }



  // return response
  return res.status(201).json(
    new apiResponse(200, createdUser, "User registered successfully")
  )
})


//token generation method
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    console.log(user)
    const refreshToken = user.generateRefreshToken()
    const accessToken = user.generateAccessToken()


    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })


    return { accessToken, refreshToken }



  } catch (error) {
    throw new apiError(500, "Something went wrong while generating refresh and acess token")

  }
}

//login user

const loginUser = asyncHandler(async (req, res) => {
  //req body -> data
  const { email, username, password } = req.body
  console.log(email, username, password)
  //username or email check
  if (!username && !email) {
    throw new apiError(400, "username or email is required")
  }
  //find the user
  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new apiError(400, "User does not found")
  }
  //password check
  // console.log(user)
  const isPasswrodValid = await user.isPasswordCorrect(password)
  if (!isPasswrodValid) {
    throw new apiError(401, "Incorrect password, Please try again")
  }
  // access and refresh token 
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

  //send cookies
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser, accessToken
        },
        "User loggedIn successfully"
      )
    )

})


// logout user 

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new apiResponse(200, {}, "User logged Out Successfully"))
})


//refresh access token

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if (!incommingRefreshToken) {
    throw new apiError(401, "unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOCKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)
    if (!user) {
      throw new apiError(401, "Invalid refresh token")
    }

    if (incommingRefreshToken !== user?.refreshToken) {
      throw new apiError(401, "Refresh token is expired or used")
    }

    const options = {
      httpOnly: true,
      secure: true,
    }
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        ),
      )
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh token")
  }

})



// change password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new apiError(400, "Incorrect old password")

  }

  user.password = newPassword
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully "))



})


//get the current user
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(200, req.user, "current user fetched successfully")
})

// update account details 
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, } = req.body

  if (!fullName || !email) {
    throw new apiError(400, "All fields are required")
  }
  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,

      }
    },
    { new: true }
  ).select("-password")
  return res
    .status(200)
    .json(new apiResponse(200, user, "Account details updated successfully"))
})


//update avatar files
const upadateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path
  if (!avatarLocalPath) {
    throw new apiError(400, "avatar file is missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  if (!avatar.url) {
    throw new apiError(400, "Error while updating on  avatar")
  }

  await User.findByIdAndUpdate(
    res.user?._id,
    {
      $set:{
        avatar: avatar.url
      }
    },
    { new: true }
  ).select("-password")

  return res
  .status(200)
  .json(new apiResponse(200,user,"Update avatar successfully"))

})


//update coverImage files
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path
  if (!coverImageLocalPath) {
    throw new apiError(400, "coverImage file is missing")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if (!coverImage.url) {
    throw new apiError(400, "Error while updating on  coverImage")
  }

  await User.findByIdAndUpdate(
    res.user?._id,
    {
      $set:{
        coverImage: coverImage.url
      }
    },
    { new: true }
  ).select("-password")

  return res
  .status(200)
  .json(new apiResponse(200,user,"Update coverImage successfully"))

})



export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, upadateUserAvatar,updateUserCoverImage}