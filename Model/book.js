const mongoose = require('mongoose');
const { response } = require('express');

const bookSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    author:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    }
});


const Book = mongoose.model('Book', bookSchema);

module.exports = {Book,bookSchema};