const express = require('express');
const router = express.Router();

const Note = require('../models/note');
const AuthMiddleware = require('../middleware/auth');

router.post("",
  AuthMiddleware,
  (req, res) => {
  console.log("Received post request...");

  Note.find({}).sort({rank: -1}).limit(1)
    .then(note => {
      if (note.length) {
        return note[0].rank + 1;
      } else {
        return 1;
      }
    })
    .then(rank => {
      const note = new Note({
        title: req.body.title,
        content: req.body.content,
        personal: (req.body.personal !== undefined) ? req.body.personal : true,
        category: undefined,
        created: req.body.created,
        updated: req.body.created,
        rank: rank,
        creator: req.authInfo.userId
      });

      note.save().then(result => {
        res.status(201).send(result);
      });
    });
});

router.get("",
  AuthMiddleware,
  (req, res) => {
  console.log("Received get request...");

  const limit = +req.query.limit;
  const page = +req.query.page;

  // Provide public notes in general
  let criteria = { personal: { $ne: true } };
  if (req.authInfo && req.authInfo.userId) {
      // If authorized, include private notes of user
      criteria = { $or: [
                  { $and: [
                    { personal: true },
                    { creator: req.authInfo.userId }
                    ] },
                  { personal: { $ne: true } }
                  ] };
  }
  const query = Note.find( criteria );

  let queryResult;

  if (limit && page) {
    query.skip(limit * (page - 1))
      .limit(limit);
  }

  query.sort({rank: 1})
    .then(result => {
      queryResult = result;
      return Note.count( criteria );
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
    personal: (req.body.personal !== undefined) ? req.body.personal : true,
    updated: new Date(req.body.updated),
    rank: req.body.rank,
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