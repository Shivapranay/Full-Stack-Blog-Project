const User = require("../../models/user/User");
const Post = require("../../models/post/Post");
const Comment = require("../../models/comment/Comment");
const appErr = require("../../utils/appErr");

const createCommentCntrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    // find the post
    const post = await Post.findById(req.params.id);
    // create the comment
    const comment = await Comment.create({
      user: req.session.userAuth,
      message,
      post: post._id,
    });

    post.comments.push(comment._id);

    // find the user
    const user = await User.findById(req.session.userAuth);

    // push the comments
    user.comments.push(comment._id);

    // disable valiation before
    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    res.redirect(`/api/v1/posts/${post._id}`);
  } catch (error) {
    next(appErr(error.message));
  }
};

const getCommentDetailsCntrl = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate("post");
   
    res.render("comments/updateComment", { comment, error: "" });
  } catch (error) {
    res.render("comments/updateComment", { error: error.message });
  }
};

const deleteCommentCntl = async (req, res, next) => {
  try {
   
    // find the post
    const comment = await Comment.findById(req.params.id);

    // check if the post belongs to the logged in user or not
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("you are not allowed to delete this comment", 403));
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.redirect(`/api/v1/posts/${req.query.postid}`);
  } catch (error) {
    return next(appErr(error.message));
  }
};

const updateCommentCntl = async (req, res, next) => {
  try {
   console.log(req.query.postId);
    // find the comment
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.render("comments/updateComment", {
        error: "comment not found",
      });
    }
    // check if the post belongs to the logged in user or not
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return res.render("comments/updateComment", {
        error: "you are not allowed to update",
      });
    }

    const commentupdated = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        message: req.body.message,
      },
      { new: true }
    );

   res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    next(appErr(error.message));
  }
};

module.exports = {
  createCommentCntrl,
  getCommentDetailsCntrl,
  deleteCommentCntl,
  updateCommentCntl,
};
