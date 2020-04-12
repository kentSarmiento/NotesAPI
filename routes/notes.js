const express = require('express');

const AuthMiddleware = require('../middleware/auth');
const GetAuthMiddleware = require('../middleware/get-auth');
const noteController = require('../controllers/note');

const router = express.Router();

router.post("", AuthMiddleware, noteController.createNote);
router.get("", GetAuthMiddleware, noteController.getNotes);
router.get("/:id", GetAuthMiddleware, noteController.getNote);
router.put("/:id", AuthMiddleware, noteController.updateNote);
router.delete("/:id", AuthMiddleware, noteController.deleteNote);

module.exports = router;