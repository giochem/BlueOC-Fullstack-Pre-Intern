const express = require("express");
const pgPool = require("../initDB");
const dalUser = require("../dal/user")(pgPool);
const bcrypt = require("bcryptjs");
const route = express.Router();

route.post("/", function (req, res) {
  const { username, name, password, role } = req.body;

  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  dalUser.getUserByUsername(username, function (error, user) {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (user && user.length > 0) {
      return res.status(400).json({ message: "Username already register" });
    }
    dalUser.postUser(
      { username, name, password: hashedPassword, role },
      function (error, user) {
        console.log("correct");
        if (error) {
          return res.status(500).json({ message: "Internal Server Error" });
        }
        return res.status(200).json(user[0]);
      }
    );
  });
});

route.get("/", function (req, res) {
  dalUser.getUsers(function (error, users) {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json(users);
  });
});

route.get("/:id", function (req, res) {
  const userId = parseInt(req.params.id);

  dalUser.getUserById(userId, function (error, user) {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (user && !user[0]) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    return res.status(200).json(user[0]);
  });
});

route.put("/:id", function (req, res) {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;

  dalUser.getUserById(userId, function (error, user) {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (user && !user[0]) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    const { username, name, password, role } = req.body;

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    dalUser.updateUser(
      userId,
      { username, name, password: hashedPassword, role },
      function (error, user) {
        if (error) {
          return res.status(500).json({ message: "Internal Server Error" });
        }
        return res.status(200).json({ message: "Update user successfully" });
      }
    );
  });
});

route.delete("/:id", function (req, res) {
  const userId = parseInt(req.params.id);

  dalUser.getUserById(userId, function (error, user) {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (user && !user[0]) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    dalUser.deleteUser(userId, function (error, result) {
      if (error) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.status(200).json({ message: "Delete user successfully" });
    });
  });
});

module.exports = route;
