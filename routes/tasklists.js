const express = require('express');

const AuthMiddleware = require('../middleware/auth');
const GetAuthMiddleware = require('../middleware/get-auth');
const listsController = require('../controllers/tasklist');

const router = express.Router();

router.post("", AuthMiddleware, listsController.createList);
router.get("", GetAuthMiddleware, listsController.getLists);
router.get("/:id", GetAuthMiddleware, listsController.getList);
router.put("/:id", AuthMiddleware, listsController.updateList);
router.delete("/:id", AuthMiddleware, listsController.deleteList);

router.post("/sort", AuthMiddleware, listsController.sortLists)
router.post("/batchUpdate", AuthMiddleware, listsController.batchUpdate)

router.get("/:id/tasks", GetAuthMiddleware, listsController.getTasks);
router.post("/getTasks", GetAuthMiddleware, listsController.getTasks)
router.post("/updateTasks", AuthMiddleware, listsController.updateTasks)
router.post("/:id/deleteTasks", AuthMiddleware, listsController.deleteTasks)
router.post("/:id/deleteFinishedTasks", AuthMiddleware, listsController.deleteFinishedTasks)

module.exports = router;