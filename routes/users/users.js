const express = require("express");
const storage = require("../../config/cloudinary");
const multer=require("multer")
const {
  registerCtrlr,
  loginCtrlr,
  userCntrlr,
  updateProfileCtrlr,
  profileCntrl,
  updateCoverPhotoCtrlr,
  updatePasswordCtrlr,
  logoutCntrlr,
  uploadProfilePhotoCtrl
} = require("../../controllers/users/users");
const protected = require("../../middlewares/protected");

const userRoute = express.Router();




// instance of multer

const upload=multer({storage})

// !==================================
// !===client side render templates====
// !===================================



// ! login
userRoute.get("/login",(req,res)=>
{
  res.render("users/login", { error: "" });
})


// !register
userRoute.get("/register", (req, res) => {
  res.render("users/register",{error:""});
});





// !upload profile photo
userRoute.get("/upload-profile-photo-form", (req, res) => {
  res.render("users/uploadProfilePhoto",{error:""});
});

// !upload profile photo
userRoute.get("/upload-cover-photo-form", (req, res) => {
  res.render("users/uploadCoverPhoto",{error:""});
});




userRoute.get("/update-user-password",(req,res)=>
{
  res.render("users/updatePassword",{error:""});
})

// POST/register

userRoute.post("/register",upload.single("profile"), registerCtrlr);

// POST/login

userRoute.post("/login", loginCtrlr);


// get/profile/:id

userRoute.get("/profile-page", protected, profileCntrl);

// PUT/update/:id

userRoute.put("/update",protected, updateProfileCtrlr);



// PUT/cover-image-upload/:id

userRoute.put("/cover-photo-upload/",protected,upload.single("profile"), updateCoverPhotoCtrlr);

// PUT/profile-photo-upload/:id

userRoute.put("/profile-photo-upload/",protected,upload.single("profile"),uploadProfilePhotoCtrl)
// PUT/update-password/:id

userRoute.put("/update-password", updatePasswordCtrlr);

// GET/logout

userRoute.get("/logout", logoutCntrlr);

// get/login

userRoute.get("/:id", userCntrlr);

module.exports = userRoute;
