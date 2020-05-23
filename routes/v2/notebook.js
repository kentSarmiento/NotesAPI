const express = require('express');

const AuthMiddleware = require('../../middleware/auth');
const GetAuthMiddleware = require('../../middleware/get-auth');
const booksController = require('../../controllers/v2/notebook');

const router = express.Router();

router.post("", AuthMiddleware, booksController.createBook);
router.get("", GetAuthMiddleware, booksController.getBooks);
router.get("/:id", GetAuthMiddleware, booksController.getBook);
router.put("/:id", AuthMiddleware, booksController.updateBook);
router.delete("/:id", AuthMiddleware, booksController.deleteBook);

router.post("/sort", AuthMiddleware, booksController.sortBooks)
router.post("/batchUpdate", AuthMiddleware, booksController.batchUpdate)

router.get("/:id/notes", GetAuthMiddleware, booksController.getNotes);
router.post("/getNotes", GetAuthMiddleware, booksController.getNotes)
router.post("/updateNotes", AuthMiddleware, booksController.updateNotes)
router.post("/:id/deleteNotes", AuthMiddleware, booksController.deleteNotes)
router.post("/:id/deleteFinishedNotes", AuthMiddleware, booksController.deleteFinishedNotes)

module.exports = router;