const express = require('express');
const router = express.Router();
const { authenticateJWT, authorize } = require('../middleware/auth.middleware');
const expenseController = require('../controllers/expense.controller');

// Apply authentication to all expense routes
router.use(authenticateJWT);

// Get all expenses (filtered by user)
router.get('/', expenseController.getAllExpenses);

// Get expense by ID
router.get('/:id', expenseController.getExpenseById);

// Create new expense
router.post('/', expenseController.createExpense);

// Update expense
router.put('/:id', expenseController.updateExpense);

// Delete expense
router.delete('/:id', expenseController.deleteExpense);

// Submit expense for approval
router.post('/:id/submit', expenseController.submitExpense);

module.exports = router;