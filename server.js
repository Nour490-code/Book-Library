const express = require('express');
const app =  express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const uuid = require('uuid');

app.use(bodyParser.json());


const PORT = process.env.PORT || 4000;
app.listen(PORT,() => console.log(`listening to port ${PORT}`));



const MONGOURL = 'mongodb+srv://nourghazy:2572004@login-nodejs-app.i8zvh.mongodb.net/nourghazy?retryWrites=true&w=majority';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(MONGOURL,options)
.then(() => console.log('Connected to mongodb!'))
.catch(err => console.log(err));
mongoose.set('useCreateIndex', true);



const {User} = require('./Model/user');

app.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).save((err) => {
        err ?  res.status(400).send(err) : res.send('OK')
     });
});


const {Admin} = require('./Model/admins');

app.post('/signupadmin', (req, res) => { 
    const ID = uuid.v1(req.body);

    const newAdmin = new Admin({
        email: req.body.email,
        password: req.body.password,
        adminID: ID
    }).save((err) => {
        err ?  res.status(400).send(err) : res.send(`Signed Up Successfuly Your ID is ${ID} `)
     });
});



app.post('/signin',isAdmin,(req,res) => {
    const userData = {
        email:req.body.email,
        password:req.body.password
    }
    User.findOne(userData, (err,user) =>{
        !user ? res.send('Invalid email or password') : res.send('Logged in');
    });
    
});

function isAdmin(req,res,next){
    const isAdmin = req.body.email;
    if(isAdmin.includes('admin')){
        const adminData = {
            email:req.body.email,
            password:req.body.password
        }
        Admin.findOne(adminData, (err,admin) =>{
            !admin ? res.send('Invalid email or password') : res.send('Logged in');
        });
    }else{
        next()
    }
}




const {Book} = require('./Model/book');
const { response } = require('express');

app.post('/admin',check,authAdmin,(req, res) => {
    const newBook = new Book({
        name: req.body.name,
        author: req.body.author,
        description: req.body.description
    }).save((err) => {
        err? res.status(400).send(err) : res.send('Book added')
     });

});

function authAdmin(req,res,next){
    if(req.body.adminID){
        Admin.findOne({adminID:req.body.adminID}, (err,admin) =>{
            !admin ? res.send('Invalid ID') : res.send('Logged in');
        });
    }else{
        next()        
    }
}
function check(req,res,next){
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send('Cannot Get Access')
    }else{
        next()
    }
}



app.post('/home',(req,res) => {
    const name = req.body.name;
    const author = req.body.author;
    
    Book.find({ $or: [ {name}, {author} ] }, (err,book) =>{
         !book ? res.send('Cannot find the book') : res.send(book);
    });
});







    //Adding Books to the user (Not finished)
     
// let usera = '';
// app.post('/addbook',logger,(req,res) => {
//     const name = req.body.name;
//     const author = req.body.author;
    
//     Book.find({ $or: [ {name}, {author} ] }, (err,singleBook) =>{
//         !singleBook ? res.send('Cannot find the book') : User.update({email: usera},{books:{singleBook}})
//     });
//     res.send(usera)
// });

// function logger(req,res,next){
//     const userData = {
//         email:req.body.email,
//         password:req.body.password
//     }
//     User.findOne(userData, (err,user) =>{
//         usera = req.body.email
//         if(err){
//             res.send('Invalid email or password')
//         }else{
//             next();
//         }
//     });
// }