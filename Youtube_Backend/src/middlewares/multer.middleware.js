import multer from "multer";
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './public';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        console.log(`Saving file to ${dir}`);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const filename = file.originalname;
        console.log(`Saving file with name ${filename}`);
        cb(null, filename);
    }
});

export const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        // Add any file validation if necessary
        cb(null, true);
    }
});
