const express = require("express")
const BooksRoutes = express.Router()
const bookController = require("./../controllers/bookController");
const checkTokken = require("../middleware/checkTokken");
const checkColeader = require("../middleware/checkColeader");
const checkId = require("../middleware/checkId");
const multer = require("multer");
const { storage, fileFilter } = require("../middleware/multer");
// Route Books
// BooksRoutes.get("/",(req,res)=>{
//     bookController.getAll(req, res);
// })
// BooksRoutes.post("/",(req,res)=>{
//     bookController.newBook(req,res)
// })

BooksRoutes
    .route("/:id")
    .get(checkId, bookController.getOne)

BooksRoutes
    .route("/")
    .get(bookController.getAll)
    .post(checkTokken, checkColeader,multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 5 } }).fields([
        { name: "cover", maxCount: 5 }
    ]), bookController.newBook)
// BooksRoutes.delete("/:id",bookController.removeOne)
// BooksRoutes.put("/:id",bookController.UpBook)
BooksRoutes
    .route("/:id")
    .put(checkTokken, checkId, checkColeader, bookController.UpBook)
    .delete(checkTokken, checkId, checkColeader, bookController.removeOne)


BooksRoutes.put("/backs/:id", checkTokken, checkId, bookController.BackBook)

module.exports = BooksRoutes
