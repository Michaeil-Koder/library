const mongoose = require("mongoose")


const checkId = (req, res, next) => {
    const id = req.body.user?.id
    const ParamsId = req.params?.id
    if (id !== undefined) {
        const isValidId = mongoose.Types.ObjectId.isValid(id)
        if (!isValidId) {
            return res.render("partials/dashboard.ejs", {
                error: "به نظر مشکلی وجود دارد ، از اینکه در سایت ثبت نام هستید اطمینان حاصل کنید.",
                page: { nil: false }
            })
        }
    }

    if (ParamsId !== undefined) {
        const isValidParamsId = mongoose.Types.ObjectId.isValid(ParamsId)
        if (!isValidParamsId) {
            return res.render("partials/dashboard.ejs", {
                error: "آیدی معتبر نمی باشد.",
                page: { nil: false }
            })
        }
    }
    next()
}
module.exports = checkId