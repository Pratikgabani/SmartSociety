import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})
// import multer from "multer";

// // We use memoryStorage to handle files as buffers in memory
// const storage = multer.memoryStorage();

// export const upload = multer({ 
//     storage, 
//     // Optional: Add file size limits or file type filters here
//     limits: {
//         fileSize: 10 * 1024 * 1024 // 10 MB file size limit
//     }
// });