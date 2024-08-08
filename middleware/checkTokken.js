const jwt = require("jsonwebtoken")
require("dotenv").config()
const userModel = require("../models/User")
// const banModel=require("../model/Ban")



const checkTokken = async (req, res, next) => {
    try {
        const AllCookie = req.headers?.cookie?.split(";") // اگر کوکی های دیگری بود جدا شود
        const cookie = AllCookie?.find(x => x.trim().startsWith("tokken="))// کوکی ای که برای jwt ست شده را پیدا کند
        const authCookie = cookie?.split("=")
        if (authCookie?.length !== 2) {
            return next()
        } else if (authCookie[1].length === 0) {
            // return res.status(401).send({ message: "لطفا وارد شوید یا ثبت کنید" })
            return res.redirect("/page/login")
        }
        const idTokken = jwt.verify(authCookie[1], process.env.JWT_SECURITY)
        const user = await userModel.findById(idTokken.id, "-password")


        req.body.user = user
        next()
    } catch (err) {
        res.status(401).send({ message: "لطفا وارد شوید یا ثبت کنید" })
    }
}


module.exports = checkTokken