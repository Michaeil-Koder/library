const isColeader = async (req, res, next) => {
    try {
        const resRole = req.body.user?.role
        if (!resRole) {
            return res.render("partials/dashboard.ejs", {
                error: "این بخش نیاز به ورود دارد ، لطفا وارد شوید.",
                page: { nil: false }
            })
        }
        if (resRole === "ADMIN" || resRole === "COLEADER") {
            next()
        } else {
            return res.render("partials/dashboard.ejs", {
                error: "این صفحه محافظت شده است.",
                page: { nil: false }
            })
        }
    }
    catch (err) {
        return res.render("partials/dashboard.ejs", {
            error: "خطایی روی داده است.",
            page: { nil: false }
        })
    }
}

module.exports = isColeader