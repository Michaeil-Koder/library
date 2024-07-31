const mongoose=require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.DbUrl)

const commentSchema=mongoose.Schema({
    body:{
        type:String,
        minLength:5
    },
    bookID:{
        type:mongoose.Types.ObjectId,
        ref:"books"
    },
    createAt:{
        type:String
    }
})

const commentModel=mongoose.model("Comment",commentSchema)

module.exports={commentModel,mongoose}