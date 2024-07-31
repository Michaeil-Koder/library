const userModel = require("./../models/User")
// const banModel = require("../../module/ban/Ban")
const moment = require("moment-jalaali")

const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const cookie = require("cookie")
const nodemailer = require("nodemailer")


exports.create = async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword } = req.body
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
        // res.setHeader("Set-Cookie", cookie.serialize("tokken", tokken), {
        //     httpOnly: true,
        //     signed: true,
        //     maxAge: 60 * 60 * 24 * 5 * 1000,
        //     // domain: req.headers.origin,
        //     path: "/"
        // })
        res.cookie("tokken", tokken, {
            httpOnly: true,
            maxAge: 60 * 1000 * 60 * 24 * 5,
            secure: true,
            path: "/"
        })
        res.status(201).send({ user: userObj })
    } catch (err) {
        console.log(err)
        return res.status(err.status || 400).send(err.message || { message: "خطایی روی داده است" })
    }
}


exports.Uplevel = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body
        const roleArray = ["ADMIN", "COLEADER"]
        const finduser = await userModel.findById(id)
        // const HasBan = await banModel.findOne({ $or: [{ user: finduser._id }, { email: finduser.email }, { phone: finduser.phone }] })
        if (!finduser) {
            return res.status(404).send({ message: "کاربری یافت نشد" })
        } else if (role === undefined || role.length === 0) {
            return res.status(405).send({ message: "نقشی را وارد کنید" })
        }
        // else if (HasBan) {
        //     return res.status(401).send({ message: "این کاربر بن شده است ، لطفا آن را از بن خارج کنید" })
        // }
        if (finduser.role === "ADMIN") {
            return res.status(400).send({ message: "این کاربر با نقش ادمین در سایت ذخیره شده است" })
        } else if (!roleArray.includes(role)) {
            return res.status(405).send({ message: "ADMIN OR COLEADER" })
        }
        const updatedAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updowngrade = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const upUser = await userModel.findByIdAndUpdate(id, { role, updowngrade, updatedAt }).select("-password -__v")
        res.send(upUser)
    } catch (err) {
        return res.status(err.status || 400).send({ message: "خطایی روی داده است" })
    }
}


exports.Downgrade = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body
        const roleArray = ["COLEADER", "USER"]
        const finduser = await userModel.findById(id)
        if (!finduser) {
            return res.status(404).send({ message: "کاربری یافت نشد" })
        } else if (role === undefined || role.length === 0) {
            return res.status(405).send({ message: "نقشی را وارد نمایید" })
        } else if (!roleArray.includes(role)) {
            return res.status(405).send({ message: "نقش را به درستی وارد نمایید" })
        } else if (finduser.role === "USER") {
            return res.status(403).send({ message: "این کاربر با نقش یوزر در سایت ذخیره شده است" })
        } else if (req.body.user.updowngrade > finduser.updowngrade && req.body.user.role === "ADMIN" && finduser.role === "ADMIN") {
            return res.status(401).send({ message: "شما مجاز به این درخواست نمی باشید" })
        } else if (req.body.user.role === "COLEADER" && finduser.role === "COLEADER") {
            return res.status(401).send({ message: "شما مجاز به این درخواست نمی باشید" })
        } else if (req.body.user.role === "COLEADER" && finduser.role === "ADMIN") {
            return res.status(401).send({ message: "شما مجاز به این درخواست نمی باشید" })
        }
        const updatedAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updowngrade = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        await userModel.findByIdAndUpdate(id, { role, updowngrade, updatedAt }).select("-password -__v")
        res.send({ message: `${finduser.name} از نقش ${finduser.role} به نقش ${role} تنزیل پیدا کرد.` })
    } catch (err) {
        return res.status(err.status || 400).send({ message: "خطایی روی داده است" })
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
        return res.status(err.status || 400).send(err.message || { message: "خطایی روی داده است" })
    }
}
exports.getMe = async (req, res) => {
    try {
        const { _id } = req.body.user
        const finduser = await userModel.findById(_id, "-password")
        // const HasBan = await banModel.findOne({ user: _id })
        if (!finduser) {
            return res.status(404).send({ message: "کاربری یافت نشد" })
        }
        // if (HasBan) {
        //     return res.status(401).send({ message: "متاسفیم شما توسط مدیر بن شده اید." })
        // } else
        res.send(finduser)
    } catch (err) {
        return res.status(err.status || 400).send(err.message || { message: "خطایی روی داده است" })
    }
}


exports.remove = async (req, res) => {
    try {
        const { id } = req.params
        const finduser = await userModel.findById(id)
        if (!finduser) {
            return res.status(404).send({ message: "کاربری یافت نشد" })
        } else if (req.body.user.role === 'COLEADER' && finduser.role === "ADMIN") {
            return res.status(403).send({ message: "شما نمی توانید ادمین را حذف کنید" })
        } else if (req.body.user.role === 'COLEADER' && finduser.role === "COLEADER") {
            return res.status(403).send({ message: "شما نمی توانید هم مقام خود را حذف کنید" })
        } else if (req.body.user.role === 'ADMIN' && finduser.role === "ADMIN" && req.body.user.updowngrade > finduser.updowngrade) {
            return res.status(403).send({ message: "شما نمی توانید ادمین قدیمی تر را حذف کنید" })
        }
        await userModel.findByIdAndDelete(id)
        res.send({ message: "حذف با موفقیت انجام شد" })
    } catch (err) {
        return res.status(err.status || 400).send({ message: "خطایی روی داده است" })
    }
}


exports.getAll = async (req, res) => {
    try {
        const id = req.body.user?.id
        const allUser = await userModel.find({ _id: { $ne: id } }, "-password -__v").lean().sort({ _id: -1 })
        if (allUser.length === 0) {
            return res.status(404).send({ message: "کاربری ایجاد نشده است" })
        }
        res.send(allUser)
    } catch (err) {
        return res.status(err.status || 400).send({ message: "خطایی روی داده است" })
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

        res.status(200).send({ message: "ورود موفقیت آمیز بود" })
    } catch (err) {
        return res.status(err.status || 400).send(err.message || { message: "خطایی روی داده است" })
    }
}

exports.logout = async (req, res) => {
    try {
        res.cookie("tokken", "", {
            httpOnly: true,
            maxAge: 1,
            secure: true,
            path: `/`
        }).send({ message: "با موفقیت خارج شدید" })
    } catch (err) {
        return res.status(err.status || 400).send({ message: "خطایی روی داده است" })
    }
}
