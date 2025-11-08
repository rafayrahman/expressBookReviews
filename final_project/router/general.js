const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
   const {username, password} = req.body;
   if (!username || !password){
    return res.status(400).json({message: "Username and Password are required"});
   }
   if (users.find(user => user.username===username)){
    return res.status(409).json({message:"Username already exists"});
   }
   users.push({username, password});
      return res.status(201).json({message:"user registered successfully!"}); 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if (book){
        return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
        return res.status(404).json({message:"Book Not Found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const allBooks = Object.values(books);
    const authorBooks = allBooks.filter(book => book.author.toLowerCase()=== author.toLowerCase()); 
    if (authorBooks.length > 0){
        return res.send(JSON.stringify(authorBooks, null, 4));
    } else {
        return res.json({message: "No books found of this author"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
   const title= req.params.title;
   const allBooks= Object.values(books);
   const titleBooks = allBooks.filter(book => book.title.toLowerCase()=== title.toLowerCase());
   if (titleBooks.length > 0){
    return res.send(JSON.stringify(titleBooks, null, 4));
   } else {
    return res.json({message : "No book found of this title"});
   }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn;
   const book = books[isbn];
   if (book) {
    return res.send(JSON.stringify(book.reviews, null, 4));
   } else {
    return res.json({message: " book not available"})
   }
});

module.exports.general = public_users;
