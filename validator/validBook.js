const validator=require("fastest-validator")
const v=new validator()

const schema={
    title:{
        type:"string",
        required:true,
        min:3,
        max:15
    },
    author:{
        type:"string",
        required:true,
        min:3,
        max:15
    },
    price:{
        type:"string",
        required:true,
        min:2,
        max:20
    },
    $$strict:true,
}

const check=v.compile(schema)

module.exports=check