const mongoose = require('mongoose');
const { response } = require('express');

const bookSchema = mongoose.Schema({
    name:{
        type: String,
        require: true,
        unique: 1,
        trim: true
    },
    author:{
        type: String,
        required: true,
        minlength:6
    },
    description:{
        type: String,
        required: true,
        minlength:6
    }
});


const Book = mongoose.model('Book', bookSchema);

module.exports = {Book};