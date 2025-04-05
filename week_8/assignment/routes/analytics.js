const express = require("express");

const pgPool = require("../initDB");
const dalAnalytic = require("../dal/analytics")(pgPool);
const middlewares = require("../middleware")();

const route = express.Router();

route.get("/books/most-borrowed", function (req, res) {
  dalAnalytic.borrowingHistory(function (error, books) {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json(books);
  });
});

module.exports = route;
