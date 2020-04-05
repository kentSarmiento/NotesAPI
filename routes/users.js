const express = require('express');
const bcrypt = require('bcrypt');

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
          error: error
        });
      });
  });
});

module.exports = router;