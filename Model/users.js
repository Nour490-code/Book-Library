const mongoose = require('mongoose');
const { response } = require('express');

const userSchema = mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: 1,
        trim: true
    },
    email:{
        type: String,
        require: true,
        unique: 1,
        trim: true
    },
    password:{
        type: String,
        require: true,
        minlength:6
    },
    userID:{
        type: String
    },
    role:{
        type:String
    },
    books:[{type:mongoose.Types.ObjectId,required:true}]
});


const User = mongoose.model('User', userSchema);

module.exports = {User};