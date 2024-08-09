const userModel = require("./../models/User")
// const banModel = require("../../module/ban/Ban")
const moment = require("moment-jalaali")

const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")




exports.ShowRegisterPage = async (req, res) => {
    try {
        res.render("register.ejs")
    } catch (error) {
        return res.status(500).send(error)
    }
}


exports.create = async (req, res) => {
    try {
        const { name, username, email, phone, password } = req.body
        const resultCheck = validationResult(req)
        if (!resultCheck.isEmpty()) {
            return res.status(405).send(resultCheck)
        }
        const regEx = new RegExp("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$", "g")
        if (!regEx.test(phone)) {
            return res.status(400).send({ message: "لطفا شماره را صحیح وارد کنید" })
        }
        const finduser = await userModel.findOne({ $or: [{ email }, { phone }] })
        // const HasBan = await banModel.findOne({ $or: [{ user: finduser?._id }, { email: finduser?.email }, { phone: finduser?.phone }] })

        // if (HasBan) {
        //     return res.status(401).send({ message: "متاسفیم این ایمیل یا شماره توسط مدیر بن شده است." })
        // }
        if (finduser) {
            return res.status(400).send({ message: "این کاربر قبلا ثبت نام کرده است" })
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const createdAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updatedAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updowngrade = moment().format("jYYYY/jMM/jDD HH:mm:ss")

        const countUserModel = await userModel.countDocuments()//length

        const newUser = await userModel.create({
            name,
            username,
            email,
            phone,
            password: hash,
            role: countUserModel > 0 ? "USER" : "ADMIN",
            updowngrade,
            createdAt,
            updatedAt
        })//create
        const userObj = newUser.toObject()

        const tokken = jwt.sign({//tokken
            id: newUser._id,
        }, process.env.JWT_SECURITY, {
            expiresIn: "5day"
        })
        delete userObj.password

        res.cookie("tokken", tokken, {
            httpOnly: true,
            maxAge: 60 * 1000 * 60 * 24 * 5,
            secure: true,
            path: "/"
        })
        res.redirect("/api/books")
    } catch (err) {
        console.log(err)
        return res.render("partials/dashboard.ejs", {
            error: "خطایی روی داده است.",
            page: { nit: false }
        })
    }
}


exports.Uplevel = async (req, res) => {
    try {
        const { id } = req.params

        const finduser = await userModel.findById(id)

        let role = null

        if (!finduser) {
            return res.redirect("/api/users/getall?error:notFound")
        }


        if (finduser.role === "ADMIN") {
            return res.redirect("/api/users/getall?error:erAdmin")
        } else if (finduser.role === "COLEADER") {
            role = "ADMIN"
        } else if (finduser.role === "USER") {
            role = "COLEADER"
        }
        const updatedAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updowngrade = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        await userModel.findByIdAndUpdate(id, { role, updowngrade, updatedAt })
        res.redirect("/api/users/getall?error:upSuccess")
    } catch (err) {
        return res.redirect("/api/users/getall?error:خطایی روی داده است.")
    }
}


exports.Downgrade = async (req, res) => {
    try {
        const { id } = req.params
        let role = null;
        const finduser = await userModel.findById(id)
        if (!finduser) {
            return res.redirect("/api/users/getall?error:notFound")
        } else if (finduser.role === "USER") {
            return res.redirect("/api/users/getall?error:user")
        } else if (req.body.user.updowngrade > finduser.updowngrade && req.body.user.role === "ADMIN" && finduser.role === "ADMIN") {
            return res.redirect("/api/users/getall?error:admin")
        } else if (finduser.role === "COLEADER") {
            role = "USER"
        } else if (finduser.role === "ADMIN") {
            role = "COLEADER"
        }
        const updatedAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updowngrade = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        await userModel.findByIdAndUpdate(id, { role, updowngrade, updatedAt }).select("-password -__v")
        res.redirect(`/api/users/getall?error:downSuccess`)
    } catch (err) {
        return res.redirect("/api/users/getall?error:false")
    }
}


exports.getOne = async (req, res) => {
    try {
        const { id } = req.params
        const findOneUser = await userModel.findById(id, "-password")
        if (!findOneUser) {
            return res.status(404).send({ message: "کاربری یافت نشد" })
        }
        res.send(findOneUser)
    } catch (err) {
        return res.render("partials/dashboard.ejs", {
            error: "خطایی روی داده است.",
            page: { nit: false }
        })
    }
}
exports.getMe = async (req, res) => {
    try {
        const { id } = req.body.user
        const finduser = await userModel.findById(id, "-password")

        let error = ""

        if (!finduser) {
            error = "کاربری یافت نشد"
        } else if (req.url.split("?").length === 2) {
            let query = req.url.split("?")[1].split(":")
            if (query[0] === "error") {
                if (query[1] === "false") {
                    error = "مشکلی رخ داده است."

                } else if (query[1] === "Nvalid") {
                    error = "لطفا به درستی فرم را پر کنید."
                } else if (query[1] === "phone") {
                    error = "شماره تلفن وارد شده صحیح نمیباشد."
                } else if (query[1] === "Success") {
                    error = "عملیات با موفقیت انجام شد."
                }
                else {
                    error = query[1]
                }
            }
        }

        res.render("partials/dashboard.ejs", {
            user: finduser,
            error,
            page: {
                informationUser: true
            }
        })
    } catch (err) {
        console.log(err)
        res.render("partials/dashboard.ejs", {
            error: "خطایی روی داده است.",
            page: { nit: false }
        })
    }
}


exports.remove = async (req, res) => {
    try {
        const { id } = req.params
        const finduser = await userModel.findById(id)
        if (!finduser) {
            return res.redirect("/api/users/getall?error:notFound")
        } else if (req.body.user.role === 'COLEADER' && finduser.role === "ADMIN") {
            return res.redirect("/api/users/getall?error:notAccess")
        } else if (req.body.user.role === 'COLEADER' && finduser.role === "COLEADER") {
            return res.redirect("/api/users/getall?error:notAccess")
        } else if (req.body.user.role === 'ADMIN' && finduser.role === "ADMIN" && req.body.user.updowngrade > finduser.updowngrade) {
            return res.redirect("/api/users/getall?error:notAccess")
        }
        await userModel.findByIdAndDelete(id)
        return res.redirect("/api/users/getall?error:Success")
    } catch (err) {
        return res.redirect("/api/users/getall?error:false")
    }
}


exports.getAll = async (req, res) => {
    try {
        const id = req.body.user?.id
        const allUser = await userModel.find({ _id: { $ne: id } }, "-password -__v").lean().sort({ _id: -1 })
        let error = "";
        let query = null;
        if (allUser.length === 0) {
            error = "کاربری ایجاد نشده است."

        } else if (req.url.split("?").length === 2) {
            query = req.url.split("?")[1].split(":")
            if (query[0] === "error") {
                if (query[1] === "false") {
                    error = "مشکلی رخ داده است."

                } else if (query[1] === "user") {
                    error = "این کاربر در نقش یوزر است."
                } else if (query[1] === "erAdmin") {
                    error = "این کاربر در نقش ادمین است."
                } else if (query[1] === "admin") {
                    error = "شما نمی توانید ادمین قبل از خود را تنزل کنید."
                } else if (query[1] === "upSuccess") {
                    error = "کاربر با موفقیت ارتقا یافت."
                } else if (query[1] === "downSuccess") {
                    error = "کاربر با موفقیت تنزل یافت."
                } else if (query[1] === "notFound") {
                    error = "کاربری یافت نشد."
                } else if (query[1] === "notAccess") {
                    error = "شما دسترسی لازم برای این عمل را ندارید."
                } else if (query[1] === "Success") {
                    error = "عملیات با موفقیت انجام شد."
                }
                else {
                    error = query[1]
                }
            }
        }
        return res.render("partials/dashboard.ejs", {
            error,
            allUser,
            page: { userList: true }
        })
    } catch (err) {
        return res.render("partials/dashboard.ejs", {
            error: "خطایی روی داده است.",
            page: { nit: false }
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, phone, password } = req.body
        const regExPhone = new RegExp("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$", "g")
        const regExEmail = new RegExp("[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+", "g")
        if (!regExPhone.test(phone) && phone !== undefined) {
            return res.status(403).send({ message: "لطفا شماره تلفن خود را به درستی وارد نمایید" })
        } else if (!regExEmail.test(email) && email !== undefined) {
            return res.status(403).send({ message: "لطفا ایمیل خود را به درستی وارد نمایید" })
        } else if (phone === undefined && email === undefined || phone?.length === 0 && email?.length === 0) {
            return res.status(403).send({ message: "لطفا فرم را پر نمایید " })
        } else if (password?.length === 0 || password === undefined) {
            return res.status(403).send({ message: "لطفا پسورد خود را به وارد نمایید" })
        }
        const finduser = await userModel.findOne({ $or: [{ email }, { phone }] })
        // const HasBan = await banModel.findOne({ $or: [{ email }, { phone }, { user: finduser._id }] })
        if (!finduser) {
            return res.status(403).send({ message: "اطلاعات وارد شده اشتباه است." })
        }
        const checkPass = bcrypt.compareSync(password, finduser.password)
        if (!checkPass) {
            return res.status(403).send({ message: "لطفا پسورد خود را به درستی وارد نمایید" })
        }
        const tokken = jwt.sign({ id: finduser._id }, process.env.JWT_SECURITY, {
            expiresIn: "5day"
        })
        res.cookie("tokken", tokken, {
            httpOnly: true,
            maxAge: 60 * 1000 * 60 * 24 * 5,
            secure: true,
            path: `/`
        })

        res.redirect("/api/books")
    } catch (err) {
        return res.render("partials/dashboard.ejs", {
            error: "خطایی روی داده است.",
            page: { nit: false }
        })
    }
}

exports.logout = async (req, res) => {
    try {
        res.cookie("tokken", "", {
            httpOnly: true,
            maxAge: 1,
            secure: true,
            path: `/`
        })
        res.redirect("/")
    } catch (err) {
        return res.render("partials/dashboard.ejs", {
            error: "خطایی روی داده است.",
            page: { nit: false }
        })
    }
}


exports.update = async (req, res) => {
    try {
        const { name, username, email, phone, user } = req.body
        const resultCheck = validationResult(req)
        if (!resultCheck.isEmpty()) {
            // return res.status(405).send(resultCheck)
            return res.redirect("/api/users/me?error:Nvalid")
        }
        const regEx = new RegExp("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$", "g")
        if (!regEx.test(phone)) {
            // return res.status(400).send({ message: "لطفا شماره را صحیح وارد کنید" })
            return res.redirect("/api/users/me?error:phone")
        }

        const updatedAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")

        const UpdateUser = await userModel.findByIdAndUpdate(user.id, {
            name,
            username,
            email,
            phone,
            updatedAt
        })//update
        res.redirect("/api/users/me?error:Success")
    } catch (err) {
        console.log(err)
        return res.render("partials/dashboard.ejs", {
            error: "خطایی روی داده است.",
            page: { nit: false }
        })
    }
}
