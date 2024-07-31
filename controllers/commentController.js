const commentModel=require("../models/Comment")
const moment=require("moment-jalaali")

const newComments=async (req,res)=>{
    try{
        const {bookID,body}=req.body
        const isValidID=commentModel.mongoose.Types.ObjectId.isValid(bookID)
        const createAt=moment().format("jYYYY/jMM/jDD HH:mm:ss")
        if(isValidID){
            const commetnRes=await commentModel.commentModel.create({body,bookID,createAt})
            res.status(200).send(commetnRes)
        }else{
            res.status(402).send({message:"Id Is Not Valid"})
        }
    }catch(error){
        res.status(405).send(error)
    }
}

const GetComment=async(req,res)=>{
    try{
        const {bookID}=req.body
        console.log(bookID);
        const resualt=await commentModel.commentModel.find({}).populate("bookID").lean()
        res.status(200).send(resualt)
    }catch(error){
        res.status(405).send(error)
    }
}

module.exports={newComments,GetComment}