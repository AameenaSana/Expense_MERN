const { getBudgets, setBudget, deleteBudget } = require('../controllers/budget');

const router = require('express').Router();

router.get('/budgets', getBudgets)
    .put('/budgets/:category', setBudget)
    .delete('/budgets/:category', deleteBudget)

module.exports = router
