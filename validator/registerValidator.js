const { body, param } = require("express-validator")
const { isValidObjectId } = require("mongoose")
const validatorBody = () => {
    return [
        body("name")
            .notEmpty()
            .withMessage("نام نباید خالی باشد")
            .isLength({ min: 3, max: 25 })
            .withMessage("نام باید حداقل 3 و حداکثر 25 کاراکتر باشد")
            .isString()
            .withMessage("لطفا با تایپ رشته وارد کنید"),
        body("username")
            .notEmpty()
            .withMessage("نام کاربری نباید خالی باشد")
            .isLength({ min: 5, max: 25 })
            .withMessage("نام کاربری باید حداقل 5 و حداکثر 25 کاراکتر باشد")
            .isString()
            .withMessage("لطفا با تایپ رشته وارد کنید"),
        body("email")
            .notEmpty()
            .withMessage("ایمیل نباید خالی باشد")
            .isString()
            .withMessage("ایمیل باید با تایپ رشته باشد"),
        body("phone")
            .notEmpty()
            .withMessage("شماره تلفن خود را وارد کنید")
            .isMobilePhone("ir-IR")
            .withMessage("لطفا شماره موبایل خود را به درستی وارد کنید"),
        body("password")
            .isLength({ min: 8, max: 30 })
            .withMessage("پسوورد باید حداقل 8 و حداکثر 30 کاراکتر باشد"),
        body("confirmPassword")
            .notEmpty()
            .withMessage("پسوورد خود را تکرار کنید")
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("دو پسوورد وارد شده باهم هم خوانی ندارد. به درستی وارد کنید")
                } else {
                    return value === req.body.password
                }
            })
    ]
}


module.exports = { validatorBody }