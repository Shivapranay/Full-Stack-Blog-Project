require("dotenv").config();
const express = require("express");
const dbConnect = require("./config/dbConnect");
const userRoute = require("./routes/users/users");
const postRoute = require("./routes/posts/posts");
const methodOverride = require("method-override");
const CommentsRoute = require("./routes/comments/comments");
const globalErrorHandler = require("./middlewares/globalHandler");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Post = require("./models/post/Post");
const { truncatePost } = require("./utils/helpers");

const app = express();
const PORT = 5678;

app.locals.truncatePost = truncatePost;

//!==================
//!=====Middlewares===
//!==================

// configure ejs

app.set("view engine", "ejs");

// serve static files
app.use(express.static(__dirname + "/public"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// methodoverride

app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGOURL,
      ttl: 24 * 60 * 60,
    }),
  })
);

app.use((req, res, next) => {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});
//!=====RENDER HOME PAGE===

app.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user")
    res.render("index", { posts });
  } catch (error) {
    res.render("index", { error: error.message });
  }
});

//!=====user route===

app.use("/api/v1/users", userRoute);

//!==================
//!=====Posts Route===
//!==================

app.use("/api/v1/posts", postRoute);

//!==================
//!=====Comments ROute===
//!==================

app.use("/api/v1/comments", CommentsRoute);

app.use(globalErrorHandler);

app.listen(PORT, console.log(`server is running on http://localhost:${PORT}`));
