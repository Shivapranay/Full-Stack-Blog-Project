const cloudinary=require("cloudinary").v2;
require("dotenv").config();
const {CloudinaryStorage}=require("multer-storage-cloudinary");


// configure cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});


// Instance of cloudinary storage

const storage=new CloudinaryStorage({
    cloudinary,
    allowedFormats:['jpg','jpeg','png'],
    params:{
        folder:"blog-app",
        transformation:[{width:500,height:500,crop:"limit"}]
    }
})

module.exports=storage;