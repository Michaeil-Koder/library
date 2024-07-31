const validator = require("fastest-validator")
const v = new validator()

const schema = {
    name: {
        type: "string",
        reqiured: true,
        min: 3,
        max: 15
    },
    username: {
        type: "string",
        reqiured: true,
        min: 5,
        max: 20
    },
    email: {
        type: "email",
        reqiured: true,
        min: 15,
        max: 50
    },
    password: {
        type: "string",
        reqiured: true,
        min: 5,
        max: 15
    },
    confirmPassword: {
        type: "equal",
        field: "password"
    },
    $$strict:true

}
const check=v.compile(schema)

module.exports=check