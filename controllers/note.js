const Note = require('../models/note');

exports.createNote = (req, res) => {
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
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating note failed!"
      });
    });
}

exports.getNotes = (req, res) => {
  console.log("Received get request...");

  const limit = +req.query.limit;
  const page = +req.query.page;

  // Provide public notes in general
  let criteria = { personal: { $ne: true } };
  if (req.query.userId) {
      criteria = { $or: [
                  { $and: [
                    { personal: true },
                    { creator: req.query.userId }
                    ] },
                  { personal: { $ne: true } }
                  ] };
  }
  const query = Note.find( criteria ).select('-content');
  let queryResult;

  if (limit && page) {
    query.skip(limit * (page - 1))
      .limit(limit);
  }

  query.sort({personal: -1, rank: 1}) // Temporary: make page for public notes
    .then(result => {
      queryResult = result;
      return Note.count( criteria );
    })
    .then(count => {
      res.status(200).json({
        notes: queryResult,
        total: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Retrieving notes failed!"
      });
    });
}

exports.getNote = (req, res) => {
  console.log("Received get request...");
  Note.findOne({_id: req.params.id})
    .then(note => {
      if (note) {
          res.status(200).send(note);
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
  console.log("Received put request for " + req.params.id);

  const note = new Note({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    personal: req.body.personal,
    updated: new Date(req.body.updated),
    rank: req.body.rank,
    creator: req.authInfo.userId
  });

  if (req.body.category) {
    note.category = req.body.category;
    console.log(note);
  }

  Note.updateOne({_id: req.params.id, creator: req.authInfo.userId}, note)
    .then(result => {
      if (result.n > 0) {
        if (result.nModified == 0) {
          res.status(500).json({message: "Updating note failed!"});
        } else {
          res.status(200).json({ message: "Update successfully!"});
        }
      } else {
        res.status(401).json({ message: "Not authorized!"});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Updating note failed!"
      });
    });
}

exports.deleteNote = (req, res) => {
  console.log('Received delete request for ' + req.params.id);

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
