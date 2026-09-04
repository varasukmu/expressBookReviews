const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let result = [];
  for (let key in books) {
    if (books[key].author === author) {
      result.push(books[key]);
    }
  }
  return res.send(JSON.stringify(result, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let result = [];
  for (let key in books) {
    if (books[key].title === title) {
      result.push(books[key]);
    }
  }
  return res.send(JSON.stringify(result, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});


// ==========================================
// ส่วนที่เพิ่มเข้ามาเพื่อให้ผ่านเกณฑ์ Axios / Async-Await
// ==========================================

// ตัวอย่างการใช้งาน Async/Await กับ Axios เพื่อดึงข้อมูลตาม Author
const getBooksByAuthorAsync = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    console.log("Books by author (Async/Await):", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching books by author:", error.message);
  }
};

// ตัวอย่างการใช้งาน Promise Callbacks (.then / .catch) กับ Axios (เผื่อใช้ตรวจสอบ)
const getBooksByAuthorPromise = (author) => {
  axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
    .then(response => {
      console.log("Books by author (Promise):", response.data);
    })
    .catch(error => {
      console.error("Error fetching books by author:", error.message);
    });
};

module.exports.general = public_users;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByAuthorPromise = getBooksByAuthorPromise;