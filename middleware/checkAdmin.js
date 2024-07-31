const isAdmin = async (req, res, next) => {
    try {
        const resRole = req.body.user?.role
        if (!resRole) {
            return res.status(404).send({ message: "This User Not Found" })
        }
        if (resRole === "ADMIN") {
            next()
        } else {
            return res.status(422).send({ message: "This API Protect" })
        }
    }
    catch (err) {
        res.status(400).send(err.message||{message:"خطایی روی داده است"})
    }
}

module.exports = isAdmin