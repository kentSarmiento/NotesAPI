const express = require('express');

const AuthMiddleware = require('../middleware/auth');
const GetAuthMiddleware = require('../middleware/get-auth');
const tasksController = require('../controllers/task');

const router = express.Router();

router.post("", AuthMiddleware, tasksController.createTask);
router.get("", GetAuthMiddleware, tasksController.getTask);
router.put("/:id", AuthMiddleware, tasksController.updateTask);
router.delete("/:id", AuthMiddleware, tasksController.deleteTask);

module.exports = router;