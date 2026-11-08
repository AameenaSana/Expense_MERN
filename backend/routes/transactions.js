const { addExpense, getExpense, updateExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, updateIncome, deleteIncome } = require('../controllers/income');
const { requireAuth } = require('../middleware/auth');

const router = require('express').Router();

// Auth is applied per route (not router.use) so unknown /api paths still get a 404
router.post('/add-income', requireAuth, addIncome)
    .get('/get-incomes', requireAuth, getIncomes)
    .put('/update-income/:id', requireAuth, updateIncome)
    .delete('/delete-income/:id', requireAuth, deleteIncome)
    .post('/add-expense', requireAuth, addExpense)
    .get('/get-expenses', requireAuth, getExpense)
    .put('/update-expense/:id', requireAuth, updateExpense)
    .delete('/delete-expense/:id', requireAuth, deleteExpense)

module.exports = router
