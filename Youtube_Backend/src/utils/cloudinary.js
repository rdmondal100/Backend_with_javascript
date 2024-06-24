
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises'; // Use fs/promises for cleaner async/await syntax
import dotenv from 'dotenv';

dotenv.config({ path: './.env' }); // Ensure correct path to .env file

// Configuration (replace with your actual Cloudinary credentials)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log("Secret:", process.env.CLOUDINARY_API_SECRET)

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error('No file path provided for upload.');
            return null;
        }

        // Check if file exists using fs.access
        await fs.access(localFilePath, fs.constants.F_OK);

        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto', 
        });

        console.log('Upload result:', uploadResult);
        return uploadResult;
    } catch (error) {
        console.error('Error uploading file:', error);
        fs.unlink(localFilePath)
        return null;
    }
};

export default uploadOnCloudinary
