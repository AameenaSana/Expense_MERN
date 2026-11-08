const { getBudgets, setBudget, deleteBudget } = require('../controllers/budget');
const { requireAuth } = require('../middleware/auth');

const router = require('express').Router();

router.get('/budgets', requireAuth, getBudgets)
    .put('/budgets/:category', requireAuth, setBudget)
    .delete('/budgets/:category', requireAuth, deleteBudget)

module.exports = router
