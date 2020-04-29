const Task = require('../models/task');

exports.createTask = (req, res) => {
  console.log("Received post request for tasks...");
  const taskInfo = new Task({
    tasksInfo: req.body.tasks,
    listsInfo: req.body.lists,
    updated: req.body.updated,
    creator: req.authInfo.userId,
    highrank: req.body.highrank
  });

  taskInfo.save().then(result => {
    res.status(201).send(result);
  });
}

exports.getTask = (req, res) => {
  console.log("Received get request for tasks...");
  Task.findOne({creator: req.authInfo.userId})
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

exports.updateTask = (req, res) => {
  console.log("Received put request for tasks...");
  const taskInfo = new Task({
    _id: req.params.id,
    tasksInfo: req.body.tasks,
    listsInfo: req.body.lists,
    updated: req.body.updated,
    creator: req.authInfo.userId,
    highrank: req.body.highrank
  });

  Task.updateOne({_id: req.params.id}, taskInfo)
    .then(result => {
      if (result.n > 0) {
        if (result.nModified == 0) {
          res.status(500).json({message: "Updating taskInfo failed!"});
        } else {
          res.status(200).json({
            message: "Update successfully!",
            updated: new Date(),
            highrank: taskInfo.highrank,
          });
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

exports.deleteTask = (req, res) => {
  console.log("Received delete request for tasks...");
}