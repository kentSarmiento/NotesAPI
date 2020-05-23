const Note = require('../../models/v2/note');

exports.createNote = (req, res) => {
  console.log("Received post request for notev2...");

  Note.find({}).sort({rank: -1}).limit(1)
    .then(notes => {
      if (notes.length) {
        return notes[0].rank + 1;
      } else {
        return 1;
      }
    })
    .then(noteRank => {
      const noteInfo = new Note({
        creator: req.authInfo.userId,
        book: req.body.book,
        title: req.body.title,
        content: req.body.content,
        id: req.body.id,
        rank: noteRank,
        created: req.body.created ? req.body.created : Date(),
        updated: req.body.updated ? req.body.updated : Date(),
        version: 1,
        locked: false,
        personal: true
      });

      noteInfo.save().then(result => {
        res.status(201).send(result);
      });
    });
}

exports.getNotes = (req, res) => {
  console.log("Received get request for notesv2...")

  const user = req.authInfo.userId ? req.authInfo.userId : req.body.user;
  let retrievedNotes;

  Note.find({creator: user})
    .then(notes => {
      retrievedNotes = notes;
      return Note.count({creator: user});
    })
    .then(count => {
      res.status(200).json({
        total: count,
        notes: retrievedNotes
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Retrieving notes failed!"
      });
    });
}

exports.getNote = (req, res) => {
  console.log("Received get request for notev2...");

  const field = req.query.field;

  Note.findOne({_id: req.params.id})
    .then(note => {
      if (note) {
        if (field === "version") {
          res.status(200).json({version: note.version});
        } else if (field === "locked") {
          res.status(200).json({locked: note.locked});
        } else {
          res.status(200).send(note);
        }
      } else {
        res.status(404).json({message: 'Note not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Retrieving note failed!"
      });
    });
}

exports.updateNote = (req, res) => {
  console.log("Received put request for notev2...");

  Note.findOne({_id: req.params.id})
    .then(note => {
      if (note) {
        note.book = req.body.book;
        note.title = req.body.title;
        note.content = req.body.content;
        note.rank = req.body.rank;
        note.updated = req.body.updated ? req.body.updated: Date();
        note.version++;
        note.locked = req.body.locked;
        note.personal = req.body.personal;

        Note.updateOne({_id: req.params.id}, note)
          .then(result => {
            res.status(200).send(note);
          });
      } else {
        res.status(404).json({message: 'Note not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Updating note failed!"
      });
    });
}

exports.deleteNote = (req, res) => {
  console.log("Received delete request for notev2...");

  Note.deleteOne({_id: req.params.id, creator: req.authInfo.userId})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deleted successfully!"});
      } else {
        res.status(401).json({ message: "Not authorized!"});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting note failed!"
      });
    });
}

function batchCreateNote(note, userId) {

  Note.find({}).sort({rank: -1}).limit(1)
    .then(notes => {
      if (notes.length) {
        return notes[0].rank + 1;
      } else {
        return 1;
      }
    })
    .then(noteRank => {
      const noteInfo = new Note({
        creator: userId,
        book: note.book,
        title: note.title,
        content: note.content,
        rank: noteRank,
        created: Date(),
        updated: Date(),
        version: 1,
        locked: false,
        personal: true
      });
      noteInfo.save().then(result => {});
    });
}

exports.batchCreate = (req, res) => {
  console.log("Received batchCreate request for notesv2...");

  const count = +req.body.total;
  for (idx = 0; idx < count; idx++) {
    batchCreateNote(req.body.notes[idx], req.authInfo.userId);
  }

  res.status(200).json({ message: "Ongoing update!"});
}

function batchUpdateNote(note) {
  const noteId = note._id;

  Note.findOne({_id: noteId})
    .then(foundNote => {
      if (foundNote) {
        foundNote.book = note.book;
        foundNote.title = note.title;
        foundNote.content = note.content;
        foundNote.rank = note.rank;
        foundNote.updated = note.updated ? note.updated: Date();
        foundNote.version++;
        foundNote.locked = note.locked;
        foundNote.personal = note.personal;

        Note.updateOne({_id: noteId}, foundNote)
          .then(result => {});
      }
    });
}

exports.sortNotes = (req, res) => {
  console.log("Received sortNotes request for notesv2...");

  const count = +req.body.total;
  for (idx = 0; idx < count; idx++) {
    batchUpdateNote(req.body.notes[idx]);
  }

  res.status(200).json({ message: "Ongoing update!"});
}

exports.batchUpdate = (req, res) => {
  console.log("Received batchUpdate request for notesv2...");

  const count = +req.body.total;
  for (idx = 0; idx < count; idx++) {
    batchUpdateNote(req.body.notes[idx]);
  }

  res.status(200).json({ message: "Ongoing update!"});
}