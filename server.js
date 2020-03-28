const express = require('express');
const bodyParser = require("body-parser");

const app = express();

var notes = [];

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

  next();
});

app.get("/", (req, res) => {
  res.status(200).send('Hello World!')
});

app.post("/notes", (req, res) => {
  const note = req.body;
  notes.push(note);

  res.status(201).send(note);
});

app.get("/notes", (req, res) => {
  res.status(200).send(notes);
});

app.listen(3000);