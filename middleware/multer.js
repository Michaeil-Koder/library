const multer=require("multer")
const path=require("path")


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/")
    },
    filename:function(req,file,cb){
        const ext=path.extname(file.originalname)
        const uniquName=`${path.basename(file.originalname,ext)}_${Math.floor(Math.random()*1E9+Date.now())}`
        cb(null,uniquName+ext)

    },
})
const uploader=multer({
    storage:storage,
    limits:{fileSize:3000}
})

module.exports=uploader