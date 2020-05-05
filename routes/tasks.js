const express = require('express');

const AuthMiddleware = require('../middleware/auth');
const GetAuthMiddleware = require('../middleware/get-auth');
const tasksController = require('../controllers/task');

const router = express.Router();

router.post("", AuthMiddleware, tasksController.createTask);
router.get("", GetAuthMiddleware, tasksController.getTasks);
router.get("/:id", GetAuthMiddleware, tasksController.getTask);
router.put("/:id", AuthMiddleware, tasksController.updateTask);
router.delete("/:id", AuthMiddleware, tasksController.deleteTask);

router.post("/sort", AuthMiddleware, tasksController.sortTasks)
router.post("/batchUpdate", AuthMiddleware, tasksController.batchUpdate)

module.exports = router;