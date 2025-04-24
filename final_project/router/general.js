const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  if(isValid(req.body.username)){
    return res.status(400).json({message: "Error: Username already exists!"});
  }
  else
  {
    let user = {
      username: req.body.username,
      password: req.body.password
    }
    users.push(user);
    return res.status(200).json({message: "Registration successful!"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let arr = Object.entries(books)
  const book_author = new Promise((resolve, reject)=>{

    let book_by_author = arr.filter((item)=>item[1].author === author)
    if(book_by_author)
    {
      resolve(book_by_author)
      // res.status(200).json(book_by_author[0][1])
    }
    else{
      // res.status(404).json({message: `No Book is found for the author: ${author}`})
      reject({message: `No Book is found for the author: ${author}`})
    }
  })

  book_author.then((resp)=>{
    res.status(200).json(resp)
  }).catch(err=>res.status(403).json({error: err}))
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let arr = Object.entries(books)

  const book_title = new Promise((resolve,reject)=>{
    let book_by_title = arr.filter((item)=>item[1].title === title)
    if(book_by_title)
    {
      // res.status(200).json(book_by_title[0][1])
      resolve(book_by_title[0][1])
    }
    else
    {
      // res.status(404).json({message: `No Book is found for the title: ${title}`})
      reject({message: `No Book is found for the title: ${title}` })
    }
  });

  book_title.then((resp)=>{
    res.status(200).json(resp)
    }).catch(err=>res.status(403).json({error: err}))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews))
});

let url="http://localhost:3000/";
const getBookDetails=async(url)=>{
      let resp = await axios.get(url);
      let books = resp.data;
      books.map((book)=>{
        console.log(book[isbn]);
        console.log(book[isbn].author);
        console.log(book[isbn].title);
        console.log(book[isbn].reviews);
      });
}

url="http://localhost:3000/isbn/";
const getBookDetailsByISBN=async(url,isbn)=>{
      let resp = await axios.get(url+isbn);
      let book = resp.data;
      console.log(book[isbn]);
}

url="http://localhost:3000/author/";
const getBookDetailsByAuthor=async(url,author)=>{
      let resp = await axios.get(url+author);
      let books = resp.data;
      books.map((book)=>{
        console.log(book[isbn]);
        console.log(book[isbn].author);
        console.log(book[isbn].title);
        console.log(book[isbn].reviews);
      });
}

url="http://localhost:3000/title/";
const getBookDetailsByTitle=async(url,title)=>{
      let resp = await axios.get(url+title);
      let books = resp.data;  
      books.map((book)=>{
        console.log(book[isbn]);
        console.log(book[isbn].author);
        console.log(book[isbn].title);
        console.log(book[isbn].reviews);
      });
}


module.exports.general = public_users;
