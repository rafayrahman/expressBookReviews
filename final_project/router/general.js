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
/*public_users.get('/',function (req, res) {
   return res.status(200).send(JSON.stringify(books, null, 4));
});*/

// Task 10: Get the book list using async/await:
public_users.get('/', async function(req, res){
    try {
        const getBooks= async ()=> {
            return new Promise((resolve, reject)=>{
                setTimeout(()=> resolve(books), 100);
            });
        };
        const allBooks = await getBooks();
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (err) {
        return res.status(500).json({message:err.message});
    }
});


// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if (book){
        return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
        return res.status(404).json({message:"Book Not Found"});
    }
 });*/

 // Task 11: Get book details based on ISBN (async/await):
 public_users.get('/isbn/:isbn', async function(req, res){
    try{
        const isbn = req.params.isbn;
        const getBookByISBN= async (isbn)=>{
            return new Promise((resolve, reject)=> {
                setTimeout (()=>{
                    if (books[isbn]) resolve(books[isbn]);
                    else reject(new Error("Book not found."));
                },100);
            });
        };
        const book = await getBookByISBN(isbn);
        return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (err) {
        res.status(404).json({message: err.message});
    }
 });
  
// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const allBooks = Object.values(books);
    const authorBooks = allBooks.filter(book => book.author.toLowerCase()=== author.toLowerCase()); 
    if (authorBooks.length > 0){
        return res.send(JSON.stringify(authorBooks, null, 4));
    } else {
        return res.json({message: "No books found of this author"});
    }
});*/

// Task 12: Get book details based on author (async/await):
public_users.get('/author/:author', async function(req,res){
    try {
        const author = req.params.author;
        const getBookByAuthor = async(author)=>{
            return new Promise((resolve, reject)=>{
                setTimeout(()=>{
                    const allBooks=Object.values(books);
                    const authorBooks = allBooks.filter(book=> book.author.toLowerCase()===author.toLowerCase());
                    if (authorBooks.length > 0) resolve(authorBooks);
                    else reject(new Error("No books found of this author"));
                },100);
            });
        };
        const authorBooks = await getBookByAuthor(author);
        return res.status(200).send(JSON.stringify(authorBooks, null, 4));
    } catch (err) {
        return res.status(404).json({message : err.message});
    }
});

// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
   const title= req.params.title;
   const allBooks= Object.values(books);
   const titleBooks = allBooks.filter(book => book.title.toLowerCase()=== title.toLowerCase());
   if (titleBooks.length > 0){
    return res.send(JSON.stringify(titleBooks, null, 4));
   } else {
    return res.json({message : "No book found of this title"});
   }
});*/

// Task 13: Get books based on title (async/await):
public_users.get('/title/:title', async function (req,res){
    try{
        const title = req.params.title;
        const getBooksByTitle = async(title)=>{
            return new Promise((resolve, reject)=>{ 
            setTimeout(()=>{
                const allBooks= Object.values(books);
                const titleBooks= allBooks.filter(book => book.title.toLowerCase()=== title.toLowerCase());
                if (titleBooks.length > 0) resolve(titleBooks);
                else reject(new Error("No book found of this title"));
            },100);
        });
    };

     const titleBooks = await getBooksByTitle(title);
     return res.status(200).send(JSON.stringify(titleBooks, null, 4));
    } catch (err){
        return res.status(404).json({message: err.message})
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
