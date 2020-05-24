const Notebook = require('../../models/v2/notebook');
const Note = require('../../models/v2/note');

exports.createBook = (req, res) => {
  console.log("Received post request for notebook...");

  Notebook.find({}).sort({rank: -1}).limit(1)
    .then(books => {
      if (books.length) {
        return books[0].rank + 1;
      } else {
        return 1;
      }
    })
    .then(bookRank => {
      const bookInfo = new Notebook({
        creator: req.authInfo.userId,
        title: req.body.title,
        rank: bookRank,
        updated: req.body.updated ? req.body.updated: Date(),
        version: 1,
        locked: false,
        personal: true
      });

      bookInfo.save().then(result => {
        res.status(201).send(result);
      });
    });
}

exports.getBooks = (req, res) => {
  console.log("Received get request for books...")

  const user = req.authInfo.userId ? req.authInfo.userId : req.body.user;
  let retrievedBooks;

  Notebook.find({creator: user})
    .then(books => {
      retrievedBooks = books;
      return Notebook.count({creator: user});
    })
    .then(count => {
      res.status(200).json({
        total: count,
        books: retrievedBooks
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Retrieving books failed!"
      });
    });
}

exports.getBook = (req, res) => {
  console.log("Received get request for book...");

  const field = req.query.field;

  Notebook.findOne({_id: req.params.id})
    .then(book => {
      if (book) {
        if (field === "version") {
          res.status(200).json({version: book.version});
        } else if (field === "locked") {
          res.status(200).json({locked: book.locked});
        } else {
          res.status(200).send(book);
        }
      } else {
        res.status(404).json({message: 'Book not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Retrieving book failed!"
      });
    });
}

exports.updateBook = (req, res) => {
  console.log("Received put request for book...");

  Notebook.findOne({_id: req.params.id})
    .then(book => {
      if (book) {
        book.title = req.body.title;
        book.rank = req.body.rank;
        book.updated = req.body.updated ? req.body.updated: Date();
        book.version++;
        book.locked = req.body.locked;
        book.personal = req.body.personal;

        Notebook.updateOne({_id: req.params.id}, book)
          .then(result => {
            res.status(200).send(book);
          });
      } else {
        res.status(404).json({message: 'Book not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Updating book failed!"
      });
    });
}

exports.deleteBook = (req, res) => {
  console.log("Received delete request for book...");

  Notebook.deleteOne({_id: req.params.id, creator: req.authInfo.userId})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deleted successfully!"});
      } else {
        res.status(401).json({ message: "Not authorized!"});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting book failed!"
      });
    });
}

function batchUpdateBook(book) {
  const bookId = book._id;

  Notebook.findOne({_id: bookId})
    .then(foundBook => {
      if (foundBook) {
        foundBook.title = book.title;
        foundBook.rank = book.rank;
        foundBook.updated = book.updated ? book.updated: Date();
        foundBook.version++;
        foundBook.locked = book.locked;
        foundBook.personal = book.personal;

        Notebook.updateOne({_id: bookId}, foundBook)
          .then(result => {});
      }
    });
}

exports.sortBooks = (req, res) => {
  console.log("Received sortBooks request for book...");

  const count = +req.body.total;
  for (idx = 0; idx < count; idx++) {
    batchUpdateBook(req.body.books[idx]);
  }

  res.status(200).json({ message: "Ongoing update!"});
}

exports.batchUpdate = (req, res) => {
  console.log("Received batchUpdate request for book...");

  const count = +req.body.total;
  for (idx = 0; idx < count; idx++) {
    batchUpdateBook(req.body.books[idx]);
  }

  res.status(200).json({ message: "Ongoing update!"});
}

exports.getNotes = (req, res) => {
  console.log("Received getNotes request for book...");

  const bookId = (req.url === "/getNotes") ? req.body.book : req.params.id;
  let retrievedNotes;

  Note.find({book: bookId})
    .then(notes => {
      retrievedNotes = notes;
      return Note.count({book: bookId});
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

function batchUpdateNote(note) {
  const noteId = note._id;

  Note.findOne({_id: noteId})
    .then(foundNote => {
      if (foundNote) {
        foundNote.book = note.book;
        foundNote.title = note.title;
        foundNote.finished = note.finished;
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

exports.updateNotes = (req, res) => {
  console.log("Received updateNotes request for book...");

  const count = +req.body.total;
  for (idx = 0; idx < count; idx++) {
    batchUpdateNote(req.body.notes[idx]);
  }

  res.status(200).json({ message: "Ongoing update!"});
}

function batchDeleteNote(note) {
  Note.deleteOne({book: note._id}).then(result => {});
}

exports.deleteNotes = (req, res) => {
  console.log("Received deleteNotes request for book...");

  Note.deleteMany({book: req.params.id})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deleted successfully!"});
      } else {
        res.status(401).json({ message: "Not authorized!"});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting book failed!"
      });
    });
}

exports.deleteFinishedNotes = (req, res) => {
  console.log("Received deleteFinishedNotes request for book...");

  Note.deleteMany({book: req.params.id, finished: true})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deleted successfully!"});
      } else {
        res.status(401).json({ message: "Not authorized!"});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting book failed!"
      });
    });
}