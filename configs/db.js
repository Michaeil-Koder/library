const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.DbUrl)
    .then(res => console.log(`Connected To DataBase`))
    .catch(rej => console.log(rej))