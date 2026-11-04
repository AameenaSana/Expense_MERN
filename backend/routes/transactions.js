const { addExpense, getExpense, updateExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, updateIncome, deleteIncome } = require('../controllers/income');

const router = require('express').Router();


router.post('/add-income', addIncome)
    .get('/get-incomes', getIncomes)
    .put('/update-income/:id', updateIncome)
    .delete('/delete-income/:id', deleteIncome)
    .post('/add-expense', addExpense)
    .get('/get-expenses', getExpense)
    .put('/update-expense/:id', updateExpense)
    .delete('/delete-expense/:id', deleteExpense)

module.exports = router