const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

// GET todos os livros
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST novo livro
router.post('/', async (req, res) => {
  const book = new Book({
    name: req.body.name,
    author: req.body.author,
    price: req.body.price,
    description: req.body.description
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Outras rotas (GET por ID, PUT, DELETE)...

module.exports = router;