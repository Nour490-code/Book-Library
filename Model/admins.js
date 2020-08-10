const mongoose = require('mongoose');
const { response } = require('express');

const adminSchema = mongoose.Schema({
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
    adminID:{
        type: String
    }
});


const Admin = mongoose.model('Admin', adminSchema);

module.exports = {Admin};