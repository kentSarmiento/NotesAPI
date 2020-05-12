const express = require('express');

const AuthMiddleware = require('../middleware/auth');
const GetAuthMiddleware = require('../middleware/get-auth');
const expenseController = require('../controllers/expense');

const router = express.Router();

router.post("", AuthMiddleware, expenseController.createExpense);
router.get("", GetAuthMiddleware, expenseController.getExpenses);
router.put("/:id", AuthMiddleware, expenseController.updateExpense);
router.delete("/:id", AuthMiddleware, expenseController.deleteExpense);

module.exports = router;