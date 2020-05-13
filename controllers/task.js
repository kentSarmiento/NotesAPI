const Task = require('../models/task');

exports.createTask = (req, res) => {
  console.log("Received post request for task...");

  Task.find({}).sort({rank: -1}).limit(1)
    .then(tasks => {
      if (tasks.length) {
        return tasks[0].rank + 1;
      } else {
        return 1;
      }
    })
    .then(taskRank => {
      const taskInfo = new Task({
        creator: req.authInfo.userId,
        list: req.body.list,
        id: req.body.id,
        title: req.body.title,
        finished: false,
        rank: taskRank,
        updated: req.body.updated ? req.body.updated: Date(),
        version: 1,
        locked: false,
        personal: true
      });

      taskInfo.save().then(result => {
        res.status(201).send(result);
      });
    });
}

exports.getTasks = (req, res) => {
  console.log("Received get request for tasks...")

  const user = req.authInfo.userId ? req.authInfo.userId : req.body.user;
  let retrievedTasks;

  Task.find({creator: user})
    .then(tasks => {
      retrievedTasks = tasks;
      return Task.count({creator: user});
    })
    .then(count => {
      res.status(200).json({
        total: count,
        tasks: retrievedTasks
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Retrieving tasks failed!"
      });
    });
}

exports.getTask = (req, res) => {
  console.log("Received get request for task...");

  const field = req.query.field;

  Task.findOne({_id: req.params.id})
    .then(task => {
      if (task) {
        if (field === "version") {
          res.status(200).json({version: task.version});
        } else if (field === "locked") {
          res.status(200).json({locked: task.locked});
        } else {
          res.status(200).send(task);
        }
      } else {
        res.status(404).json({message: 'Task not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Retrieving task failed!"
      });
    });
}

exports.updateTask = (req, res) => {
  console.log("Received put request for task...");

  Task.findOne({_id: req.params.id})
    .then(task => {
      if (task) {
        task.list = req.body.list;
        task.title = req.body.title;
        task.finished = req.body.finished;
        task.rank = req.body.rank;
        task.updated = req.body.updated ? req.body.updated: Date();
        task.version++;
        task.locked = req.body.locked;
        task.personal = req.body.personal;

        Task.updateOne({_id: req.params.id}, task)
          .then(result => {
            res.status(200).send(task);
          });
      } else {
        res.status(404).json({message: 'Task not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Updating task failed!"
      });
    });
}

exports.deleteTask = (req, res) => {
  console.log("Received delete request for task...");

  Task.deleteOne({_id: req.params.id, creator: req.authInfo.userId})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deleted successfully!"});
      } else {
        res.status(401).json({ message: "Not authorized!"});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting task failed!"
      });
    });
}

function batchCreateTask(task, userId) {
  const taskId = task._id;

  Task.find({}).sort({rank: -1}).limit(1)
    .then(tasks => {
      if (tasks.length) {
        return tasks[0].rank + 1;
      } else {
        return 1;
      }
    })
    .then(taskRank => {
      const taskInfo = new Task({
        creator: userId,
        list: task.list,
        id: task.id,
        title: task.title,
        finished: false,
        rank: taskRank,
        updated: Date(),
        version: 1,
        locked: false,
        personal: true
      });
      taskInfo.save().then(result => {});
    });
}

exports.batchCreate = (req, res) => {
  console.log("Received batchCreate request for tasks...");

  const count = +req.body.total;
  for (idx = 0; idx < count; idx++) {
    batchCreateTask(req.body.tasks[idx], req.authInfo.userId);
  }

  res.status(200).json({ message: "Ongoing update!"});
}

function batchUpdateTask(task) {
  const taskId = task._id;

  Task.findOne({_id: taskId})
    .then(foundTask => {
      if (foundTask) {
        foundTask.list = task.list;
        foundTask.title = task.title;
        foundTask.finished = task.finished;
        foundTask.rank = task.rank;
        foundTask.updated = task.updated ? task.updated: Date();
        foundTask.version++;
        foundTask.locked = task.locked;
        foundTask.personal = task.personal;

        Task.updateOne({_id: taskId}, foundTask)
          .then(result => {});
      }
    });
}

exports.sortTasks = (req, res) => {
  console.log("Received sortLists request for tasks...");

  const count = +req.body.total;
  for (idx = 0; idx < count; idx++) {
    batchUpdateTask(req.body.tasks[idx]);
  }

  res.status(200).json({ message: "Ongoing update!"});
}

exports.batchUpdate = (req, res) => {
  console.log("Received batchUpdate request for tasks...");

  const count = +req.body.total;
  for (idx = 0; idx < count; idx++) {
    batchUpdateTask(req.body.tasks[idx]);
  }

  res.status(200).json({ message: "Ongoing update!"});
}