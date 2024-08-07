const multer = require("multer")
const path = require("path")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "uploads", "covers"))
    },
    filename: function (req, file, cb) {
        const filename = String(Math.floor(Date.now() + Math.random() * 9999999))
        const ext = path.extname(file.originalname)
        const basename = path.basename(file.originalname, ext)
        cb(null, basename + "_" + filename + ext)
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = ["image/jpg", "image/jpeg", "image/png", "image/webp"]
    if (!imageType.includes(file.mimetype)) {
        cb(new Error("please select image"))
    } else {
        cb(null, true)
    }
}

module.exports = {
    storage,
    fileFilter
}
