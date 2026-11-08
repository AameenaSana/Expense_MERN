const BudgetModel = require("../models/BudgetModel")
const { handleError, LIMITS } = require("./transactionHelpers")

exports.getBudgets = async (req, res) => {
    try {
        const budgets = await BudgetModel.find({user: req.user._id}).sort({category: 1})
        res.status(200).json(budgets)
    } catch (error) {
        handleError(res, error)
    }
}

// Create or replace the monthly budget for one expense category
exports.setBudget = async (req, res) => {
    const category = (req.params.category || '').trim()
    const amount = Number(req.body && req.body.amount)

    if (!category || category.length > LIMITS.category) {
        return res.status(400).json({message: 'Invalid category'})
    }
    if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({message: 'Budget must be a positive number'})
    }
    if (amount > LIMITS.maxAmount) {
        return res.status(400).json({message: 'Budget is too large'})
    }

    try {
        const budget = await BudgetModel.findOneAndUpdate(
            {user: req.user._id, category},
            {user: req.user._id, category, amount: Math.round(amount * 100) / 100},
            {new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true}
        )
        res.status(200).json({message: 'Budget Saved', data: budget})
    } catch (error) {
        handleError(res, error)
    }
}

exports.deleteBudget = async (req, res) => {
    const category = (req.params.category || '').trim()
    try {
        const deleted = await BudgetModel.findOneAndDelete({user: req.user._id, category})
        if (!deleted) {
            return res.status(404).json({message: 'Budget not found'})
        }
        res.status(200).json({message: 'Budget Deleted'})
    } catch (error) {
        handleError(res, error)
    }
}
