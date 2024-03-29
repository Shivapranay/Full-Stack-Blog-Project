const express = require("express");
const {
  createPostCtrl,
  getPostsCntrl,
  getPostDetailsCntrl,
  deletePostCtrl,
  updatePostCtrl,
} = require("../../controllers/posts/posts");
const protected = require("../../middlewares/protected");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const Post = require("../../models/post/Post");

const postRoute = express.Router();

// instance of multer

const upload = multer({
  storage,
});

// forms

postRoute.get("/get-post-form", (req, res) => {
  res.render("posts/addPost.ejs", { error: "" });
});
// POST
postRoute.get("/update-post-form/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("posts/updatePost", { post, error: "" });
  } catch (error) {
    res.render("posts/updatePost", { error, post: "" });
  }
});

postRoute.post("/", protected, upload.single("file"), createPostCtrl);

// GET

// GET/:id

postRoute.get("/:id", getPostDetailsCntrl);

// DELETE/:id

postRoute.delete("/:id", protected, deletePostCtrl);

//  PUT/:id

postRoute.put("/:id", protected, upload.single("file"), updatePostCtrl);

module.exports = postRoute;
