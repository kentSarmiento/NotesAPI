const express = require('express');
const router = express.Router();

const Note = require('../models/note');
const AuthMiddleware = require('../middleware/auth');

router.get("/:userId/notes",
  AuthMiddleware,
  (req, res) => {
  console.log("Received get request for a user...");

  const limit = +req.query.limit;
  const page = +req.query.page;
  const criteria = { creator: req.params.userId };
  const query = Note.find( criteria );

  let notebook;

  if (limit && page) {
    query.skip(limit * (page - 1))
      .limit(limit);
  }

  query
    .then(result => {
      notebook = result;
      return Note.count( criteria );
    })
    .then(count => {
      res.status(200).json({
        notes: notebook,
        total: count
      });
    });
});

module.exports = router;