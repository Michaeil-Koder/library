const mongoose=require("mongoose")
mongoose.connect(process.env.DbUrl)



const BooksMongooseSchema=mongoose.Schema({
  title: {
    type:String,
    required:true,
    minLength:3,
    maxLength:15
  },
  author: {
    type:String,
    required:true,
    minLength:3,
    maxLength:15
  },
  price: {
    type:Number,
    minLength:2,
    maxLength:15
  },
  free:{
    type:Number
  },
  createAt:{
    type:String
  },
  updatedAt:{
    type:String
  }
})


BooksMongooseSchema.virtual("comment",{
  ref:"Comment",
  localField:"_id",
  foreignField:"bookID"
})

const BooksMongooseModel=mongoose.model("books",BooksMongooseSchema)
module.exports = {
  BooksMongooseModel,
  mongoose,
};
