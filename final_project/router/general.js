const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// ----------- internal endpoint for axios to fetch raw book data -----------
public_users.get('/data/books', (req, res) => {
  return res.status(200).json(books);
});

// -------------------- Task 6: Register --------------------
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// -------------------- Task 10: Get all books (Axios + async/await) --------------------
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/data/books`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// -------------------- Task 11: Get book by ISBN (Axios + async/await) --------------------
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/data/books`);
    const data = response.data;
    const isbn = req.params.isbn;

    if (!data[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(data[isbn]);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving book by ISBN" });
  }
});

// -------------------- Task 12: Get books by author (Axios + async/await) --------------------
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/data/books`);
    const data = response.data;
    const author = req.params.author;

    const matches = Object.values(data).filter((book) => book.author === author);

    if (matches.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(200).json(matches);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// -------------------- Task 13: Get books by title (Axios + async/await) --------------------
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/data/books`);
    const data = response.data;
    const title = req.params.title;

    const matches = Object.values(data).filter((book) => book.title === title);

    if (matches.length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }

    return res.status(200).json(matches);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// -------------------- Task 5: Get reviews --------------------
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/data/books`);
    const data = response.data;
    const isbn = req.params.isbn;

    if (!data[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(data[isbn].reviews);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving reviews" });
  }
});

module.exports.general = public_users;