const express = require('express');
const app =  express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const uuid = require('uuid');
const async = require('async')

app.use(bodyParser.json());


const PORT = process.env.PORT || 4000;
app.listen(PORT,() => console.log(`listening to port ${PORT}`));



const MONGOURL = 'mongodb+srv://nourghazy:2572004@login-nodejs-app.i8zvh.mongodb.net/nourghazy?retryWrites=true&w=majority';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}
mongoose.connect(MONGOURL,options)
.then(() => console.log('Connected to mongodb!'))
.catch(err => console.log(err));
mongoose.set('useCreateIndex', true);



const {User} = require('./Model/users');

app.post('/register', (req, res) => {
    const ID = uuid.v1(req.body);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: "User",
        books:"",
        userID: ID
    }).save((err) => {
        err ?  res.status(400).send(err) : res.send(`Signed up successfuly`)
     });
});


const {Admin} = require('./Model/admins');

app.post('/signupadmin', (req, res) => { 
    const ID = uuid.v1(req.body);

    const newAdmin = new Admin({
        email: req.body.email,
        password: req.body.password,
        adminID: ID,
        role: "Admin"
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
        !user ? res.send('Invalid email or password') : res.send(`Logged in and your ID is ${user.userID}`);
    });
    
});
let personRole = ''
function isAdmin(req,res,next){
    const adminData = {
        email:req.body.email,
        password:req.body.password
    }

    Admin.findOne(adminData, (err,admin) =>{
        if(!admin){
            next()
        }else{
            personRole = admin.role;
            res.send('Logged in')
        }
    });
}




const {Book} = require('./Model/book');
const { response } = require('express');
const user = require('./Model/users');

app.post('/admin',check,(req, res) => {
    Admin.findOne({adminID:req.body.adminID}, (err,admin) =>{
        if(!admin){
            res.send('Invalid ID')
        }else{
            const newBook = new Book({
                name: req.body.name,
                author: req.body.author,
                description: req.body.description
            }).save((err) => {
                err? res.status(400).send(err) : res.send('Book added')
             });
                  
        }
    });
});
function check(req,res,next){
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send('Please enter your ID')
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







   
     
let newBook = '' 
let findUser = ''
let userD = ''
function validUser(req,res,next){
    const userID = {userID: req.body.userID}
    findUser = userID
    User.findOne(userID, (err,user) =>{
        const booksLength = user.books;
        userD = user;
        if(user){
            if(booksLength.length > 5){
                res.send("You can't have more than 5 books")
            }else{
                
                next()   
            }
        }else{
            res.send('Invalid User')
            console.log(err)
        }
    })
}
function validBook(req,res,next){
    const bookName = {name: req.body.name}
    Book.findOne(bookName,  (err,singleBook) =>{
       if(!singleBook){
           res.send('Cannot find the book')
           console.log(err)
       }else{
           newBook = singleBook
           next()
       }
    })
}


app.post('/addbook', validUser,validBook,queue,(req,res) => {
    User.findOneAndUpdate({userID: req.body.userID},{$push : {books: {newBook} }},{},
        (err,result) => err? console.log(err) : res.send('Book Added')
    )
});

function queue(req,res,next){
    User.findOne({books: {newBook}}, (err,book) =>{
        if(!book){
            next()
        }else{
            res.send(`Waiting For Users Or You Already Have The Book`)
        }
    });
}

