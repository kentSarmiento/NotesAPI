const express = require('express');
const router = express.Router();

const Note = require('../models/note');

var notes = [];

router.post("", (req, res) => {
  console.log("Received post request...");

  const note = new Note( req.body );

  notes.push(note);
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

router.put("/:id", (req, res) => {
  console.log("Received put request for " + req.params.id);

  const note = new Note({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    author: req.body.author,
    });

  Note.updateOne({_id: req.params.id}, note)
    .then(documents => {
      res.status(200).send(documents);
    });
});

router.delete("/:id", (req, res) => {
  console.log('Received delete request for ' + req.params.id);

  Note.deleteOne({_id: req.params.id})
    .then(result => {
      res.status(200).end();
    });
});

module.exports = router;