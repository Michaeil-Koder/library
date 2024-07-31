const express = require("express")
const server = express()
const cors = require("cors")
server.use(express.json())
server.use(express.urlencoded({ extended: false }))

require("./configs/db")



const uploader = require("./middleware/multer")


const booksRoutes = require("./routes/booksRoutes");
const usersRoutes = require("./routes/userRoutes")
const rentRoutes = require("./routes/rentsRoutes");
const commentRoutes = require("./routes/commentsRoutes");

// Middleware
server.use(cors())

// Route Users
server.use("/api/users/", usersRoutes)
// Route Books
server.use("/api/books/", booksRoutes)
// Route Rents
server.use("/api/books/rent", rentRoutes)

// uploade file
server.post("/api/photo", uploader.single("profile"), async (req, res) => {
    res.status(200).send(req.file)
})

// comment book
server.use("/api/books/comment", commentRoutes)



server.listen(process.env.PORT, () => {
    console.log(`Server Running On Port ${process.env.PORT}`);
});
