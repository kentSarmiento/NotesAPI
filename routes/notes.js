const express = require('express');
const router = express.Router();

const Note = require('../models/note');
const AuthMiddleware = require('../middleware/auth');

router.post("",
  AuthMiddleware,
  (req, res) => {
  console.log("Received post request...");

  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    creator: req.authInfo.userId
  });

  note.save().then(result => {
    res.status(201).send(result);
  });
});

router.get("", (req, res) => {
  console.log("Received get request...");

  const limit = +req.query.limit;
  const page = +req.query.page;
  const query = Note.find();

  let queryResult;

  if (limit && page) {
    query.skip(limit * (page - 1))
      .limit(limit);
  }

  query
    .then(result => {
      queryResult = result;
      return Note.count();
    })
    .then(count => {
      res.status(200).json({
        notes: queryResult,
        total: count
      });
    });
});

router.get("/:id", (req, res) => {
  console.log("Received get request...");

  Note.findOne({_id: req.params.id})
    .then(note => {
      if (note) {
        res.status(200).send(note);
      } else {
        res.status(404).json({message: 'Note not found!'});
      }
    });
});

router.put("/:id",
  AuthMiddleware,
  (req, res) => {
  console.log("Received put request for " + req.params.id);

  const note = new Note({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    creator: req.authInfo.userId
  });

  Note.updateOne({_id: req.params.id, creator: req.authInfo.userId}, note)
    .then(result => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update successfully!"});
      } else {
        res.status(401).json({ message: "Not authorized!"});
      }
    });
});

router.delete("/:id",
  AuthMiddleware,
  (req, res) => {
  console.log('Received delete request for ' + req.params.id);

  Note.deleteOne({_id: req.params.id, creator: req.authInfo.userId})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deleted successfully!"});
      } else {
        res.status(401).json({ message: "Not authorized!"});
      }
    });
});

module.exports = router;