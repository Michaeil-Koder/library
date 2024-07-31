const moment = require("moment-jalaali")
const { rentModel } = require("../models/Rent")
const { BooksMongooseModel } = require("../models/Book")


const NewRent = async (req, res) => {
    try {
        let { user, bookID } = req.body
        const BookFree = await BooksMongooseModel.findById(bookID)
        if (BookFree.free !== 1) {
            return res.status(401).send({ message: "Book Is Not Free" })
        }
        const createAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updatedAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const userId = user.id;
        const ResRent = await rentModel.create({ userID: userId, bookID, createAt })
        await BooksMongooseModel.findByIdAndUpdate(bookID, { free: 0, updatedAt })
        res.status(200).send(ResRent)
    }
    catch (error) {
        res.status(405).send(error)
    }
}


const GetMeRent = async (req, res) => {
    try {
        const { user } = req.body
        const rentsMe = await rentModel.find({ userID: user.id }).lean().sort({ createAt: -1 })

        res.status(200).send({ rents: rentsMe })

    } catch (error) {
        res.status(405).send(error)
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