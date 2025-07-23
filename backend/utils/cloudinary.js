
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"


dotenv.config({
    path : "./.env"
})
// configure cloudinary 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key :process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) =>{
    console.log("Uploading on cloudinary", localFilePath)
    try {
        if(!localFilePath) return null
      const response = await cloudinary.uploader.upload(
            localFilePath , {
                resource_type: "auto",
                // This will automatically detect that what type of file is coming 
            }
        )        
     console.log("FileUploaded on cloudinary . File src : " + response.url )
        // once the file is uploaded , we would like to delete it from our server 
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

const deleteFromCloudinary = async (publicId) =>{
    try {
        //yaha pe agar resource type auto likhta hu toh vieo delete nahi 
        // hota lekin video likhta hu toh delete ho jata hai aisa isiliye hota hai kyun ki
        //  cloudinary ko pata chal jata hai ki kis type ka file delete karna hai ..usko auto me confusion hota hai kyuki auto me kuch bhi ho sakta hai
       const result = await cloudinary.uploader.destroy(publicId,{
            resource_type: "video"   
       })        
       console.log("Deleted from cloudinary public id ",result)
       return result
    } catch (error) {
        console.log("Error deleting from cloudinary")
        return null
    }
}

export {uploadOnCloudinary  ,  deleteFromCloudinary}
// import { v2 as cloudinary } from "cloudinary";
// import streamifier from "streamifier";
// import dotenv from "dotenv";

// dotenv.config({ path: "./.env" });

// // Configure Cloudinary with your credentials
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// /**
//  * Uploads a file from a buffer to Cloudinary.
//  * @param {Buffer} fileBuffer The file buffer from req.file.buffer.
//  * @returns {Promise<object|null>} The Cloudinary response object or null on failure.
//  */
// const uploadOnCloudinary = (fileBuffer) => {
//     if (!fileBuffer) {
//         console.error("Upload failed: No file buffer provided.");
//         return null;
//     }

//     return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//             {
//                 resource_type: "auto" // Automatically detect file type
//             },
//             (error, result) => {
//                 if (error) {
//                     console.error("Cloudinary upload error:", error);
//                     reject(error);
//                 } else {
//                     resolve(result);
//                 }
//             }
//         );

//         // Pipe the buffer to the upload stream
//         streamifier.createReadStream(fileBuffer).pipe(uploadStream);
//     });
// };

// /**
//  * Deletes a file from Cloudinary.
//  * @param {string} publicId The public_id of the file to delete.
//  * @param {string} resourceType The resource_type of the file (e.g., 'image', 'video').
//  * @returns {Promise<object|null>} The Cloudinary deletion result or null on failure.
//  */
// const deleteFromCloudinary = async (publicId, resourceType = "image") => {
//     if (!publicId) {
//         console.error("Delete failed: No publicId provided.");
//         return null;
//     }
    
//     try {
//         // You MUST provide the resource_type for deletion to work correctly.
//         // 'auto' does not work for deletion.
//         const result = await cloudinary.uploader.destroy(publicId, {
//             resource_type: resourceType  
//         });
//         console.log("Successfully deleted from Cloudinary. Result:", result);
//         return result;
//     } catch (error) {
//         console.error("Error deleting from Cloudinary:", error);
//         return null;
//     }
// };

// export { uploadOnCloudinary, deleteFromCloudinary };