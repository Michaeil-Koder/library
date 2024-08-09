const userControllers = require("./../controllers/userControllers")
const exprees = require("express")
const Router = exprees.Router()

const checkAdmin = require("./../middleware/checkAdmin")
const checkColeader = require("./../middleware/checkColeader")
const checkBodyId = require("./../middleware/checkBodyId")
const checkTokken = require("./../middleware/checkTokken")
const checkId = require("./../middleware/checkId")
const { validatorBody, validatorRegisterBody } = require("../validator/registerValidator")



Router.route("/register")
    .get(userControllers.ShowRegisterPage)
    .post(validatorBody(), userControllers.create)


Router.route("/update")
    .post(validatorRegisterBody(), userControllers.update)

Router.route("/getAll")
    .get(checkTokken, checkId, checkColeader, userControllers.getAll)


Router.route("/me")
    .get(checkTokken, checkId, userControllers.getMe)


Router.route("/login")
    .get(userControllers.ShowRegisterPage)
    .post(userControllers.login)


Router.route("/logout")
    .post(checkTokken, checkId, userControllers.logout)


Router.route("/:id/Downgrade")
    .post(checkTokken, checkId, checkAdmin, userControllers.Downgrade)




Router.route("/:id")
    .post(checkTokken, checkId, checkAdmin, userControllers.Uplevel)
    .get(checkTokken, checkId, checkColeader, userControllers.getOne)
// .delete(checkTokken, checkId, checkColeader, userControllers.remove)

Router.route("/:id/remove")
    .post(checkTokken, checkId, checkColeader, userControllers.remove)

module.exports = Router