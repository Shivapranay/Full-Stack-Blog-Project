const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    message: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

// !model

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
