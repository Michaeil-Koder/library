const mongoose = require("mongoose")
const schema = mongoose.Schema({
    name: {
        type: String,
        reqiured: true,
        minLength: 3,
        maxLength: 25
    },
    username: {
        type: String,
        reqiured: true,
        minLength: 5,
        maxLength: 25
    },
    email: {
        type: String,
        reqiured: true,
        minLength: 10,
        maxLength: 70
    },
    phone: {
        type: String,
        reqiured: true,
        minLength: 10,
        maxLength: 16
    },
    password: {
        type: String,
        reqiured: true,
        minLength: 8,
    },
    crime: {
        type: Number,
        positive: true,
        default: 0
    },
    role: {
        type: String,
        default: "USER"
    },
    updowngrade: {
        type: String,
    },
    createdAt: {
        type: String,
    },
    updatedAt: {
        type: String,
    }
})



const model = mongoose.model("User", schema)

module.exports = model