const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    } ,
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:String,
    admin:{
        type:Boolean,
        default:false
    }
})

module.exports = userSchema