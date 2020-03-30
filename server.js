const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Note = require('./models/note');

const app = express();

var notes = [];

/* Connect to database */
mongoose.connect("mongodb+srv://manager:XDeU8k0xSsInSY3f@clusterfree-g7tel.mongodb.net/notes-app?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection to database failed!");
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  const headers = [
    {
      "name": "Access-Control-Allow-Origin",
      "value": "*"
    },
    {
      "name": "Access-Control-Allow-Headers",
      "value": "Origin, X-Requested-With, Content-Type, Accept"
    },
    {
      "name": "Access-Control-Allow-Methods",
      "value": "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    },
  ];

  for (var i=0; i < headers.length; i++) {
    res.setHeader(headers[i]['name'], headers[i]['value']);
  }

  next(); // Trigger other middlewares
});

app.post("/notes", (req, res) => {
  console.log("Received post request...");

  /*
   * Method 1: mapping
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    category: req.body.category,
  });
   *
   * Method 2: direct
   */
  const note = new Note( req.body );

  notes.push(note);
  note.save().then(result => {
    res.status(201).send(result);
  });
});

app.get("/notes", (req, res) => {
  console.log("Received get request...");

  Note.find()
    .then(documents => {
      res.status(200).send(documents);
    });
});

app.put("/notes/:id", (req, res) => {
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

app.delete("/notes/:id", (req, res) => {
  console.log('Received delete request for ' + req.params.id);

  Note.deleteOne({_id: req.params.id})
    .then(result => {
      res.status(200).end();
    });
});

app.listen(3000);