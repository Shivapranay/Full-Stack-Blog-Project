const express = require("express");
const { createCommentCntrl,getCommentDetailsCntrl,deleteCommentCntl,updateCommentCntl } = require("../../controllers/comments/comments");
const protected=require("../../middlewares/protected")

const CommentsRoute = express.Router();


// POST

CommentsRoute.get("/update-comment",(req,res)=>
{
   res.render("comments/updateComment",{error:"",comment:""})
})
CommentsRoute.post("/:id",protected,createCommentCntrl);



// GET/:id

CommentsRoute.get("/:id",getCommentDetailsCntrl );

// DELETE/:id

CommentsRoute.delete("/:id",protected,deleteCommentCntl );

//  PUT/:id

CommentsRoute.put("/:id",protected,updateCommentCntl );

module.exports=CommentsRoute;