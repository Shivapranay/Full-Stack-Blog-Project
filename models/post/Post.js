const mongoose=require("mongoose");

const postSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:["react js","html","css","node js","javascript","other"],
    },
    image:{
        type:String,
        required:true
    },
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:"Comment"}],
    user:{
        type:mongoose.Schema.Types.ObjectId,ref:"User"
    }
    
},{timestamps:true})


// !model

const Post=mongoose.model("Post",postSchema);

module.exports=Post;