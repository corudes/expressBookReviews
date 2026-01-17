const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// returns true if username is NOT already used (valid for registration)
const isValid = (username) => {
  const userExists = users.some((user) => user.username === username);
  return !userExists;
};

// returns true if username and password match records
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// ================= LOGIN =================
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  const accessToken = jwt.sign(
    { username: username },
    "fingerprint_customer",
    { expiresIn: 3600 }
  );

  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "Login successful" });
});

// ================= ADD / UPDATE REVIEW =================
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const username = req.user && req.user.username ? req.user.username : null;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  books[isbn].reviews[username] = review;

  return res
    .status(200)
    .json({ message: "Review added/updated successfully" });
});

// ================= DELETE REVIEW =================
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const username = req.user && req.user.username ? req.user.username : null;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[username];

  return res
    .status(200)
    .json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
