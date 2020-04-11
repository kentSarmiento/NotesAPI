const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res, next) => {
  console.log("Received new signup request...");

  bcrypt.hash(req.body.password, 8).then(hash => {
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hash
    });

    user
      .save()
      .then(result => {
        res.status(201).send(result);
      })
      .catch(error => {
        res.status(500).json({
           message: "Account creation failed!"
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  console.log("Received new login request...");

  let foundUser;
  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed! Username not found"
        });
      }
      foundUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!foundUser) return;
      if (!result) {
        return res.status(401).json({
          message: "Authentication failed! Incorrect password"
        });
      }
      const token = jwt.sign(
        { username: foundUser.username, userId: foundUser._id },
        "secret_token",
        { expiresIn: "24h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: (60 * 60 *24),
        userId: foundUser._id
      });
    });
});

module.exports = router;