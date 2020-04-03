const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const notesRoutes = require('./routes/notes');
const categoryRoutes = require('./routes/categories');

const app = express();

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

app.use("/notes", notesRoutes);
app.use("/categories", categoryRoutes);

app.listen(3000);