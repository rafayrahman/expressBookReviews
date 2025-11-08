const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    return users.some(user=>user.username===username);
}

const authenticatedUser = (username,password)=>{ 
    return users.some(user => user.username===username && user.password===password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if (!username || !password){
    return res.status(400).json({message: " username and passwords are required "})
  }
  if(authenticatedUser(username,password)){
    const token = jwt.sign({username:username}, 'fingerprint_customer',{expiresIn : '1hr'});
    return res.status(200).json({message: "User logged in successfully!", token:token});
  } else {
    return res.status(401).json({message:"Invalid username or password!"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
   const isbn = req.params.isbn;
   const review= req.query.review;
   const token = req.headers.authorization?.split(" ")[1];
   if (!token){
    return res.status(401).json({message:"User not logged in !"})
   }
   let username;
   try{
    const decoded =jwt.verify(token, 'fingerprint_customer')
    username=decoded.username;
   } catch (err) {
     return res.status(401).json({message: "Invalid or expired token!"});
   }
   const book=books[isbn];
   if(!book){
    return res.status(404).json({message:"Book not found"});
   }
   if(!review){
    return res.status(400).json({message:"Review text is required"});
   }
   book.reviews[username]=review;
   return res.status(200).json({
        message:`Review added/updated successfully for ISBN ${isbn}`, 
        reviews: book.reviews
    });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token){
        return res.status(401).json({message: "User not logged in"});
    }
    let username;
    try {
        const decoded=jwt.verify(token, 'fingerprint_customer');
        username=decoded.username;
    } catch (err) {
        return res.status(401).json({message:"Invalid or expired token"});
    }
    const book =books[isbn];
    if (!book){
        return res.status(404).json({message: "Book not found"});
    }
    if(book.reviews[username]){
        delete book.reviews[username];
        return res.status(200).json({message:`Review deleted successfully for ISBN ${isbn}`, review:book.reviews});
    } else {
        return res.status(404).json({message: "No review by this user to delete"});
    }

});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
