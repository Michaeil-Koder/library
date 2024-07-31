const express = require("express")
const commentController = require("../controllers/commentController")
const checkTokken = require("../middleware/checkTokken")
const commentRoute = express.Router()


commentRoute
    .route("/")
    .post(checkTokken, commentController.newComments)
    .get(commentController.GetComment)


module.exports = commentRoute