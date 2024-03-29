const bcrypt = require("bcryptjs");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");

// register
const registerCtrlr = async (req, res, next) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    res.render("users/register", { error: "All fields are required" });
  }
  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      res.render("users/register", { error: "user already exist" });
    }

    //  hash a password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // register

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.json(error);
  }
};

// login

const loginCtrlr = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("users/login", { error: "All fields are required" });
  }
  try {
    // check if email exist
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.render("users/login", { error: "Invalid login credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (!isPasswordValid) {
      return res.render("users/login", { error: "Invalid login credentials" });
    }
    req.session.userAuth = userFound._id;

    // redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/login", { error: error.message });
  }
};

// get user
const userCntrlr = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    res.render("users/updateUser", { user, error: "" });
  } catch (error) {
    return res.render("users/updateUser", { error: error.message });
  }
};

// get profile
const profileCntrl = async (req, res) => {
  try {
    const userId = req.session.userAuth;
    const user = await User.findById(userId)
      .populate("posts")
      .populate("comments");
  console.log(user)
    res.render("users/profile", { user });
  } catch (error) {
    res.json(error.message);
  }
};

//  update the password
const updatePasswordCtrlr = async (req, res, next) => {
  const { password } = req.body;
  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordhashed = await bcrypt.hash(password, salt);
      await User.findByIdAndUpdate(req.session.userAuth, {
        password: passwordhashed,
      });
      res.redirect("/api/v1/users/profile-page");
    }
  } catch (error) {
    return res.render("users/updatePassword", {
      error: error.message,
    });
  }
};

//  update cover photo of profile

const updateCoverPhotoCtrlr = async (req, res) => {
  try {
    if (!req.file) {
      res.render("users/uploadCoverPhoto", {
        error: "please upload image",
      });
    }
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);

    if (!userFound) {
      res.render("users/uploadCoverPhoto", {
        error: "user not found",
      });
    }
    await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      { new: true }
    );

    res.redirect("/api/v1/users/profile-page");
  } catch (err) {
    res.render("users/uploadCoverPhoto", {
      error: err.message,
    });
  }
};
//  update the profile
const updateProfileCtrlr = async (req, res, next) => {
  const { fullname, email } = req.body;

  try {
    if (!fullname || !email) {
      return res.render("users/updateUser", {
        error: "please provide details",
        user: "",
      });
    }
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        res.render("users/updateUser", {
          error: "email is already taken",
          user: "",
        });
      }
    }

    await User.findByIdAndUpdate(
      req.session.userAuth,
      {
        fullname,
        email,
      },
      { new: true }
    );

    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.render("users/updateUser", {
      error: err.message,
      user: "",
    });
  }
};

const uploadProfilePhotoCtrl = async (req, res) => {
  try {
    if (!req.file) {
      res.render("users/uploadProfilePhoto", {
        error: "please upload image",
      });
    }
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);

    if (!userFound) {
      res.render("users/uploadProfilePhoto", {
        error: "user not found",
      });
    }
    await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      { new: true }
    );

    res.redirect("/api/v1/users/profile-page");
  } catch (err) {
    res.render("users/uploadProfilePhoto", {
      error: err.message,
    });
  }
};

//  logout
const logoutCntrlr = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/api/v1/users/login");
  });
};

module.exports = {
  registerCtrlr,
  loginCtrlr,
  userCntrlr,
  updateProfileCtrlr,
  profileCntrl,
  updateCoverPhotoCtrlr,
  updatePasswordCtrlr,
  logoutCntrlr,
  uploadProfilePhotoCtrl,
};
