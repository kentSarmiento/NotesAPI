const express = require('express');

const AuthMiddleware = require('../../middleware/auth');
const GetAuthMiddleware = require('../../middleware/get-auth');
const notesController = require('../../controllers/v2/note');

const router = express.Router();

router.post("", AuthMiddleware, notesController.createNote);
router.get("", GetAuthMiddleware, notesController.getNotes);
router.get("/:id", GetAuthMiddleware, notesController.getNote);
router.put("/:id", AuthMiddleware, notesController.updateNote);
router.delete("/:id", AuthMiddleware, notesController.deleteNote);

router.post("/batchCreate", AuthMiddleware, notesController.batchCreate)
router.post("/sort", AuthMiddleware, notesController.sortNotes)
router.post("/batchUpdate", AuthMiddleware, notesController.batchUpdate)

module.exports = router;