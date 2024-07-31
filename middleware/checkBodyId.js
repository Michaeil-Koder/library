const mongoose = require("mongoose")

const fsPromises = require('fs').promises;
const path = require('path');


const checkBodyId = async (req, res, next) => {
    try {
        const { product, creator, category, mainCommentID, commentID, adminID, userID, bookID } = req.body
        const { sessionID } = req.params
        if (product !== undefined && product.length !== 0) {
            const checkID = mongoose.Types.ObjectId.isValid(product)
            if (!checkID) {
                return res.status(423).send({ message: "product Not Valid" })
            }
        } else if (creator !== undefined && creator.length !== 0) {
            const checkID = mongoose.Types.ObjectId.isValid(creator)
            if (!checkID) {
                return res.status(423).send({ message: "creator Not Valid" })
            }
        } else if (category !== undefined && category.length !== 0) {
            const checkID = mongoose.Types.ObjectId.isValid(category)
            if (!checkID) {
                return res.status(423).send({ message: "category Not Valid" })
            }
        } else if (sessionID !== undefined && sessionID.length !== 0) {
            const checkID = mongoose.Types.ObjectId.isValid(sessionID)
            if (!checkID) {
                return res.status(423).send({ message: "sessionID Not Valid" })
            }
        } else if (mainCommentID !== undefined && mainCommentID.length !== 0) {
            const checkID = mongoose.Types.ObjectId.isValid(mainCommentID)
            if (!checkID) {
                return res.status(423).send({ message: "mainCommentID Not Valid" })
            }
        } else if (commentID !== undefined && commentID.length !== 0) {
            const checkID = mongoose.Types.ObjectId.isValid(commentID)
            if (!checkID) {
                return res.status(423).send({ message: "commentID Not Valid" })
            }
        } else if (adminID !== undefined && adminID.length !== 0) {
            const checkID = mongoose.Types.ObjectId.isValid(adminID)
            if (!checkID) {
                return res.status(423).send({ message: "adminID Not Valid" })
            }
        }
        if (userID !== undefined && userID.length !== 0) {
            const checkID = mongoose.Types.ObjectId.isValid(userID)
            if (!checkID) {
                return res.status(423).send({ message: "userID Not Valid" })
            }
        } else if (bookID !== undefined && bookID.length !== 0) {
            try {
                const checkID = mongoose.Types.ObjectId.isValid(bookID);
                if (!checkID) {
                    return res.status(423).send({ message: "bookID Not Valid" });
                }
            } catch (err) {
                throw new Error(err.message);
            }
        }
        next()
    } catch (err) {
        return res.status(err.status || 400).send(err.message || { message: "مشکلی رخ داده" })
    }
}
module.exports = checkBodyId