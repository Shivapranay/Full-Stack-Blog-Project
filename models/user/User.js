const mongoose = require("mongoose");

// ! SChema
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    role: {
      type: String,
      default: " Blogger",
    },
    bio: {
      type: String,
      default: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia assumenda perferendis facere voluptatem? Excepturi aliquid quam illum aperiam animi reiciendis."
    },
    posts: [{ type: mongoose.Schema.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

// !model

const User = mongoose.model("User", userSchema);

module.exports = User;
