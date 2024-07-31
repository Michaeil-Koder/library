const { GetAllRent, NewRent, GetMeRent } = require("../controllers/rentController")
const express = require("express")
const checkTokken = require("../middleware/checkTokken")
const checkColeader = require("../middleware/checkColeader")
const checkBodyId = require("../middleware/checkBodyId")
const rentRoute = express.Router()

rentRoute
    .route("/")
    .post(checkTokken, checkBodyId, NewRent)
    .get(checkTokken, checkColeader, GetAllRent)

rentRoute
    .route("/me")
    .get(checkTokken, GetMeRent)

module.exports = rentRoute
