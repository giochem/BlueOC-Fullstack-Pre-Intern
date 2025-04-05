const express = require("express");
const pgPool = require("../initDB");
const dalAuth = require("../dal/auth.js")(pgPool);
const bcrypt = require("bcryptjs");

const route = express.Router();
const JWT_SECRET = "mySecret";

route.post("/login", function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }
  dalAuth.loginUser(username, password, function (error, user) {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid username or password." });
    }
    const token = require("jsonwebtoken").sign(
      { username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ token });
  });
});

module.exports = route;
