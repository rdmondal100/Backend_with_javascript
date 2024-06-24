
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises'; // Use fs/promises for cleaner async/await syntax
import dotenv from 'dotenv';
import { apiError } from './apiError';

dotenv.config({ path: './.env' }); // Ensure correct path to .env file

// Configuration (replace with your actual Cloudinary credentials)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log("Secret:", process.env.CLOUDINARY_API_SECRET)


export const deleteCloudinaryFile = async (fileUrl) => {
  try {
    if (!fileUrl) {
      throw new apiError(400, "File url is missing")
    }

    await fs.access(localFilePath, fs.constants.F_OK);

    const deleteFile = await cloudinary.uploader.destroy(fileUrl)
    console.log(deleteFile)
    return deleteFile
  } catch (error) {
    throw new apiError(400, "Failed to delete the file/image")

  }


}