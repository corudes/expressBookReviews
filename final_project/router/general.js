const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// ---------------- INTERNAL DATA ENDPOINT ----------------
// Axios will fetch book data from here
public_users.get('/data/books', async (req, res) => {
  res.status(200).json(books);
});

// ---------------- TASK 1: Get all books ----------------
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/data/books`);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// ---------------- TASK 2: Get by ISBN ----------------
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/data/books`);
    const booksData = response.data;
    const book = booksData[req.params.isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving book by ISBN" });
  }
});

// ---------------- TASK 3: Get by Author ----------------
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/data/books`);
    const booksData = response.data;
    const author = req.params.author;

    const results = Object.values(booksData).filter(
      book => book.author === author
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// ---------------- TASK 4: Get by Title ----------------
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/data/books`);
    const booksData = response.data;
    const title = req.params.title;

    const results = Object.values(booksData).filter(
      book => book.title === title
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// ---------------- TASK 5: Get reviews ----------------
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/data/books`);
    const booksData = response.data;
    const book = booksData[req.params.isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book.reviews);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving reviews" });
  }
});

module.exports.general = public_users;