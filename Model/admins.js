const mongoose = require('mongoose');
const { response } = require('express');

const adminSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: 1,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength:6
    },
    role:{
        type:String
    },
    adminID:{
        type: String
    }
});


const Admin = mongoose.model('Admin', adminSchema);

module.exports = {Admin};