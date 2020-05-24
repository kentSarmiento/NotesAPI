const mongoose = require('mongoose');

const NoteSrc = require('../models/note');
const NoteDest = require('../models/v2/note');

function migrateNote(note) {
  const noteInfo = new NoteDest({
    creator: note.creator,
    book: note.book,
    title: note.title,
    content: note.content,
    id: note.id,
    rank: note.rank,
    created: note.created,
    updated: note.updated,
    version: 1,
    locked: false,
    personal: true
  });

  noteInfo.save()
    .then(result => {
      console.log(result);
    });
}

function migrateNotes() {

  NoteSrc.find({ })
    .then(notes => {
      for (idx = 0; idx < notes.length; idx++) {
        migrateNote(notes[idx]);
      }
    });
}

mongoose.connect("mongodb+srv://manager:XDeU8k0xSsInSY3f@clusterfree-g7tel.mongodb.net/notes-app")
  .then(() => {
    console.log("Connected to database!");
    migrateNotes();
  })
  .catch(() => {
    console.log("Connection to database failed!");
  });
