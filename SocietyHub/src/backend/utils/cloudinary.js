
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()
// configure cloudinary 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key :process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null
      const response = await cloudinary.uploader.upload(
            localFilePath , {
                resource_type: "image"
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
