const TaskList = require('../models/tasklist');
const Task = require('../models/task');

exports.createList = (req, res) => {
  console.log("Received post request for tasklist...");

  TaskList.find({}).sort({rank: -1}).limit(1)
    .then(lists => {
      if (lists.length) {
        return lists[0].rank + 1;
      } else {
        return 1;
      }
    })
    .then(listRank => {
      const listInfo = new TaskList({
        creator: req.authInfo.userId,
        title: req.body.title,
        rank: listRank,
        updated: req.body.updated ? req.body.updated: Date(),
        version: 1,
        locked: false,
        personal: true
      });

      listInfo.save().then(result => {
        res.status(201).send(result);
      });
    });
}

exports.getLists = (req, res) => {
  console.log("Received get request for lists...")

  const user = req.authInfo.userId ? req.authInfo.userId : req.body.user;
  let retrievedLists;

  TaskList.find({creator: user})
    .then(lists => {
      retrievedLists = lists;
      return TaskList.count({creator: user});
    })
    .then(count => {
      res.status(200).json({
        total: count,
        lists: retrievedLists
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Retrieving lists failed!"
      });
    });
}

exports.getList = (req, res) => {
  console.log("Received get request for list...");

  const field = req.query.field;

  TaskList.findOne({_id: req.params.id})
    .then(list => {
      if (list) {
        if (field === "version") {
          res.status(200).json({version: list.version});
        } else if (field === "locked") {
          res.status(200).json({locked: list.locked});
        } else {
          res.status(200).send(list);
        }
      } else {
        res.status(404).json({message: 'List not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Retrieving list failed!"
      });
    });
}

exports.updateList = (req, res) => {
  console.log("Received put request for list...");

  TaskList.findOne({_id: req.params.id})
    .then(list => {
      if (list) {
        list.title = req.body.title;
        list.rank = req.body.rank;
        list.updated = req.body.updated ? req.body.updated: Date();
        list.version++;
        list.locked = req.body.locked;
        list.personal = req.body.personal;

        TaskList.updateOne({_id: req.params.id}, list)
          .then(result => {
            res.status(200).send(list);
          });
      } else {
        res.status(404).json({message: 'List not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Updating list failed!"
      });
    });
}

exports.deleteList = (req, res) => {
  console.log("Received delete request for list...");

  TaskList.deleteOne({_id: req.params.id, creator: req.authInfo.userId})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deleted successfully!"});
      } else {
        res.status(401).json({ message: "Not authorized!"});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting list failed!"
      });
    });
}

function batchUpdateList(list) {
  const listId = list._id;

  TaskList.findOne({_id: listId})
    .then(foundList => {
      if (foundList) {
        foundList.title = list.title;
        foundList.rank = list.rank;
        foundList.updated = list.updated ? list.updated: Date();
        foundList.version++;
        foundList.locked = list.locked;
        foundList.personal = list.personal;

        TaskList.updateOne({_id: listId}, foundList)
          .then(result => {});
      }
    });
}

exports.sortLists = (req, res) => {
  console.log("Received sortLists request for list...");

  const count = +req.body.total;
  for (idx = 0; idx < count; idx++) {
    batchUpdateList(req.body.lists[idx]);
  }

  res.status(200).json({ message: "Ongoing update!"});
}

exports.batchUpdate = (req, res) => {
  console.log("Received batchUpdate request for list...");

  const count = +req.body.total;
  for (idx = 0; idx < count; idx++) {
    batchUpdateList(req.body.lists[idx]);
  }

  res.status(200).json({ message: "Ongoing update!"});
}

exports.getTasks = (req, res) => {
  console.log("Received getTasks request for list...");

  const listId = (req.url === "/getTasks") ? req.body.list : req.params.id;
  let retrievedTasks;

  Task.find({list: listId})
    .then(tasks => {
      retrievedTasks = tasks;
      return Task.count({list: listId});
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

exports.updateTasks = (req, res) => {
  console.log("Received updateTasks request for list...");

  const count = +req.body.total;
  for (idx = 0; idx < count; idx++) {
    batchUpdateTask(req.body.tasks[idx]);
  }

  res.status(200).json({ message: "Ongoing update!"});
}

function batchDeleteTask(task) {
  Task.deleteOne({list: task._id}).then(result => {});
}

exports.deleteTasks = (req, res) => {
  console.log("Received deleteTasks request for list...");

  Task.deleteMany({list: req.params.id})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deleted successfully!"});
      } else {
        res.status(401).json({ message: "Not authorized!"});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting list failed!"
      });
    });
}