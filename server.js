const express = require("express");
const server = express();
const cors = require("cors");
const session = require("express-session")
const flash = require("express-flash")
const path = require("path")



require("./configs/db");


const booksRoutes = require("./routes/booksRoutes");
const usersRoutes = require("./routes/userRoutes");
const rentRoutes = require("./routes/rentsRoutes");
const commentRoutes = require("./routes/commentsRoutes");
const checkTokken = require("./middleware/checkTokken");

// Middleware
server.use(express.json())
server.use(express.urlencoded({ extended: false }))

server.use("/css", express.static(path.join(__dirname, "./public/css")))
server.use("/fonts", express.static(path.join(__dirname, "./public/fonts")))
server.use("/images", express.static(path.join(__dirname, "./public/images")))
server.use("/js", express.static(path.join(__dirname, "./public/js")))
server.use("/uploads", express.static(path.join(__dirname, "./uploads/covers")))

server.set("view engine", "ejs")
server.set("views", path.join(__dirname, "./views"))
server.use(cors({
  origin: "*"
}))
server.use(session({
  saveUninitialized: true,
  resave: false,
  secret: process.env.SESSION_SECURITY
}))
server.use(flash())


// Home page 
server.use("/", (req, res, next) => {
  if (req.path === "/") {
    return res.render("homepage.ejs")
  }
  next()
})

// Route Users
server.use("/api/users/", usersRoutes);
// Route Books
server.use("/api/books/", booksRoutes);
// Route Rents
server.use("/api/books/rent", rentRoutes);


// comment book
server.use("/api/books/comment", commentRoutes);

server.listen(process.env.PORT, () => {
  console.log(`Server Running On Port ${process.env.PORT}`);
});
