const Post = require("../../models/post/Post");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");

const createPostCtrl = async (req, res, next) => {
  const { title, description, category, user } = req.body;

  try {
    if (!title || !description || !category || !req.file) {
      return res.render("posts/addPost", { error: "All fields are required" });
    }
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    console.log(userFound);

    const postCreated = await Post.create({
      title,
      description,
      category,
      user: userFound._id,
      image: req.file.path,
    });

    // push the postCreated into the array of users
    userFound.posts.push(postCreated._id);
    await userFound.save();
    res.redirect("/");
  } catch (error) {
    return res.render("posts/addPost", { error: error.message });
  }
};

const getPostsCntrl = async (req, res) => {
  try {
    const posts = await Post.find().populate("comments");

    res.json({
      status: "Succes",
      posts: posts,
    });
  } catch (error) {
    res.json(error);
  }
};

const getPostDetailsCntrl = async (req, res, next) => {
  try {
    const id = req.params.id
    console.log(id)
    const post = await Post.findById(id).populate({
        path: "comments",
        populate: {
          path: "user",
        },
      }).populate("user");
   
    res.render("posts/postDetails", {
      post,
      error: "",
    });
 
  } catch (error) {
    res.json({
      error: error.message,
      stack: error.stack,
    });
  }
};

const deletePostCtrl = async (req, res, next) => {
  try {
    // find the post
    const post = await Post.findById(req.params.id);

    // check if the post belongs to the logged in user or not
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/postDetails", {
        error: "you are not authorized to delete this post",
        post: "",
      });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    return res.render("posts/postDetails", {
      error: error.message,
    });
  }
};

const updatePostCtrl = async (req, res) => {
  const { title, description, category } = req.body;
  try {
    // find the post
    const post = await Post.findById(req.params.id);

    // check if the post belongs to the logged in user or not
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/updatePost", {
        error: "you are not allowed to uda",
        post: "",
      });
    }

    if (req.file) {
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
          image: req.file.path,
        },
        { new: true }
      );
    } else {
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
        },
        { new: true }
      );
    }

    res.redirect("/");
  } catch (error) {
    return res.render("posts/updatePost", {
      error: error.message,
      post: "",
    });
  }
};

module.exports = {
  createPostCtrl,
  getPostsCntrl,
  getPostDetailsCntrl,
  deletePostCtrl,
  updatePostCtrl,
};
