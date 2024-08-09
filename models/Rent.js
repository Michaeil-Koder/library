const mongoose = require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.DbUrl)


const rentSchema = mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },

    bookID: {
        type: mongoose.Types.ObjectId,
        ref: "books"
    },
    createAt: {
        type: String,
    },

})

rentSchema.virtual("Book", {
    ref: "books",
    localField: "bookID",
    foreignField: "_id",
});

const rentModel = mongoose.model("rents", rentSchema)

module.exports = {
    rentModel,
    mongoose
}