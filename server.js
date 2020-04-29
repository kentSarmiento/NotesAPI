const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const notesRoutes = require('./routes/notes');
const tasksRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

const app = express();

/* Connect to database */
mongoose.connect(process.env.MONGO_DB_SERVER)
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
      "value": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
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
app.use("/tasks", tasksRoutes);
app.use("/users", userRoutes);

app.listen(process.env.PORT || 8080);
