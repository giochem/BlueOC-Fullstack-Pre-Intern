const express = require("express");

const pgPool = require("../initDB");
const dalBook = require("../dal/book")(pgPool);
const middlewares = require("../middleware")();

const route = express.Router();

route.get("/", function (req, res) {
  // get books from DAL layer and DB
  dalBook.getBooks(
    req.query,
    req.query.limit,
    req.query.offset,
    function (error, books) {
      if (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }

      res.status(200).json(books);
      return;
    }
  );
});

route.post("/", middlewares.authAdmin, function (req, res) {
  // post book from DAL layer and DB
  dalBook.postBook(req.body, function (error, books) {
    if (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(201).json({ message: "Created book successfully" });
  });
});

route.get("/:id", function (req, res) {
  const bookId = parseInt(req.params.id);
  // get details book by id from DAL layer and DB
  dalBook.getBookByID(bookId, function (error, books) {
    if (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
    if (books && !books[0]) {
      return res.status(404).json({ message: `Book ${bookId} not found` });
    }
    return res.json(books[0]);
  });
});

route.delete("/:id", middlewares.authAdmin, function (req, res) {
  const bookID = parseInt(req.params.id);
  dalBook.getBookByID(bookID, function (error, books) {
    if (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
    if (books && !books[0]) {
      return res.status(404).json({ message: `Book ${bookID} not found` });
    }
    dalBook.deleteBook(bookID, function (error, books) {
      if (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }

      return res.status(200).json({ message: "Delete book successfully" });
    });
  });
});

route.post("/borrowing-book", middlewares.authAdmin, function (req, res) {
  const { userId, bookId, borrowedDate, returnedDate } = req.body;

  dalBook.borrowingBook(
    {
      userId: parseInt(userId),
      bookId: parseInt(bookId),
      borrowedDate: new Date(borrowedDate).toISOString(),
      returnedDate: new Date(returnedDate).toISOString(),
    },
    function (error, books) {
      if (error) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.status(200).json({ message: "Borrowing book successfully" });
    }
  );
});

module.exports = route;
