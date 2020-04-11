const express = require('express');

const AuthMiddleware = require('../middleware/auth');
const noteController = require('../controllers/note');

const router = express.Router();

router.post("", AuthMiddleware, noteController.createNote);
router.get("", AuthMiddleware, noteController.getNotes);
router.get("/:id", noteController.getNote);
router.put("/:id", AuthMiddleware, noteController.updateNote);
router.delete("/:id", AuthMiddleware, noteController.deleteNote);

module.exports = router;