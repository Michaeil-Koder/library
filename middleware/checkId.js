const mongoose = require("mongoose")


const checkId = (req, res, next) => {
    const id = req.body.user?.id
    const ParamsId = req.params.id
    if (id !== undefined) {
        const isValidId = mongoose.Types.ObjectId.isValid(id)
        if (!isValidId) {
            return res.status(400).send({ message: "This Id Not Valid" })
        }
    }// else {
    //     return res.status(401).send({ message: "لطفا وارد شوید یا ثبت کنید" })
    //     // return res.redirect("/page/login")
    // }
    if (ParamsId !== undefined) {
        const isValidParamsId = mongoose.Types.ObjectId.isValid(ParamsId)
        if (!isValidParamsId) {
            return res.status(400).send({ message: "This Id Params Not Valid" })
        }
    }
    next()
}
module.exports = checkId