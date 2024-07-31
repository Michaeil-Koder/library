const moment = require("moment-jalaali")
const BookModel = require("./../models/Book");
const checkBody = require("../validator/validBook")

const getAll = async (req, res) => {
  try {
    const books = await BookModel.BooksMongooseModel.find({}).lean()

    res.status(200).send(books)
  } catch (error) {
    res.status(404).send(error)
  }
};
const getOne = async (req, res) => {
  try {
    const { id } = req.params
    const book = await BookModel.BooksMongooseModel.findById(id)

    res.status(200).send(book)
  } catch (error) {
    res.status(404).send(error)
  }
};

const removeOne = async (req, res) => {
  try {
    const bookID = req.params.id
    const isValid = BookModel.mongoose.Types.ObjectId.isValid(bookID)
    if (!isValid) {
      return res.status(403).send({ message: "Is Id Not Valid" })
    }
    const removedBook = await BookModel.BooksMongooseModel.findByIdAndDelete(bookID);
    if (!removedBook) {
      return res.status(404).send({ message: "Id Not Find!" })
    }
    res.status(200).send(removedBook)
  } catch (error) {
    res.status(400).send(error)
  }
};

const newBook = async (req, res) => {
  try {
    const ResultCheckBody = checkBody(req.body)
    if (ResultCheckBody !== true) {
      res.status(422).send(ResultCheckBody)
    } else {
      let { title, author, price } = req.body
      const createAt = moment().format("jYYYY/jM/jD HH:mm:ss")
      const updatedAt = moment().format("jYYYY/jM/jD HH:mm:ss")
      const BookN = await BookModel.BooksMongooseModel.create({ title, author, price, free: 1, createAt, updatedAt })
      res.status(201).send(BookN)
    }
  } catch (error) {
    res.status(404).send(error)
  }
}

const BackBook = async (req, res) => {
  try {
    const bookID = req.params.id
    console.log(bookID);
    const isValid = BookModel.mongoose.Types.ObjectId.isValid(bookID)
    const updatedAt = moment().format("jYYYY/jM/jD HH:mm:ss")
    if (!isValid) {
      return res.status(403).send({ message: "Id Is Not Valid" })
    }
    const BookDb = await BookModel.BooksMongooseModel.findById(bookID)
    if (!BookDb) {
      return res.status(404).send({ message: "Id Is Not Find" })
    } else if (BookDb.free === 1) {
      return res.status(405).send({ message: "Book Is Free" })
    } else {
      await BookModel.BooksMongooseModel.findByIdAndUpdate(bookID, { free: 1, updatedAt })
      res.status(200).send({ message: "Book Back Successfully" })
    }
  }
  catch (err) {
    res.status(400).send(err)
  }
}

const UpBook = async (req, res) => {
  try {
    const bookID = req.params.id
    const DataValidBody = checkBody(req.body)
    const isValid = BookModel.mongoose.Types.ObjectId.isValid(bookID)
    const updatedAt = moment().format("jYYYY/jM/jD HH:mm:ss")
    if (!isValid) {
      return res.status(403).send({ message: "Id Is Not Valid" })
    }
    const BookDb = await BookModel.BooksMongooseModel.findById(bookID)
    if (!BookDb) {
      return res.status(404).send({ message: "Book Is Not Found!" })
    } else if (DataValidBody !== true) {
      return res.status(406).send(DataValidBody)
    } else {
      await BookModel.BooksMongooseModel.findByIdAndUpdate(bookID, { ...req.body, updatedAt: updatedAt })
      res.status(200).send({ message: "Book Update Successfully" })
    }
  }
  catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  getAll,
  removeOne,
  newBook,
  BackBook,
  UpBook,
  getOne
};
