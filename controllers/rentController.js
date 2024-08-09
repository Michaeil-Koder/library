const moment = require("moment-jalaali")
const { rentModel } = require("../models/Rent")
const { BooksMongooseModel } = require("../models/Book")


const NewRent = async (req, res) => {
    try {
        let { user, bookID } = req.body
        const BookFree = await BooksMongooseModel.findById(bookID)
        if (BookFree.free !== 1) {
            // return res.render("partials/dashboard.ejs", {
            //     books: [],
            //     error: "این کتاب را فرد دیگری به امانت برده است.",
            //     page: {
            //         bookList: true
            //     }
            // })
            return res.redirect("/api/books?rented:false")
        }
        const createAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updatedAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const userId = user.id;
        const ResRent = await rentModel.create({ userID: userId, bookID, createAt })
        await BooksMongooseModel.findByIdAndUpdate(bookID, { free: 0, updatedAt })
        res.redirect("/api/books/rent/me?rented:true")
    }
    catch (error) {
        res.status(405).send(error)
    }
}


const GetMeRent = async (req, res) => {
    try {
        const { user } = req.body
        let error = ""
        const rentsMe = await rentModel.find({ userID: user.id }).lean().populate("Book").sort({ createAt: -1 })
        let query = null;
        if (req.url.split("?").length === 2) {
            query = req.url.split("?")[1].split(":")
            if (query[0] === "rented" && query[1] === "true") {
                error = "کتاب با موفقیت قرض گرفته شد."
            }
        }

        res.render("partials/dashboard.ejs", {
            error,
            rentsMe,
            page: {
                RentedBooks: true
            }
        })

    } catch (error) {
        console.log(error)
        res.render("partials/dashboard.ejs", {
            error: "خطایی روی داده است.",
            rentsMe: [],
            page: {
                RentedBooks: true
            }
        })
    }
}


const GetAllRent = async (req, res) => {
    try {
        const AllRent = await rentModel.find({}).populate("userID", "name username email").populate("bookID").lean()
        res.status(200).send(AllRent)
    } catch (error) {
        res.status(405).send(error)
    }
}

module.exports = {
    NewRent,
    GetAllRent,
    GetMeRent
}