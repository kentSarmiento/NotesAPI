const express = require('express');
const router = express.Router();

const Category = require('../models/category');

router.post("", (req, res) => {
  console.log("Received post request...");

  const category = new Category( req.body );

  category.save().then(category => {
    res.status(201).send(category);
  });
});

router.get("", (req, res) => {
  console.log("Received get request...");

  Category.find()
    .then(categories => {
      res.status(200).send(categories);
    });
});

module.exports = router;