const mongoose = require('mongoose');

// A monthly spending limit for one expense category
const BudgetSchema = new mongoose.Schema({
    // Owner of this budget
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        maxLength: [30, "Category must be at most 30 characters"]
    },
    amount: {
        type: Number,
        required: true,
        min: [0.01, "Budget must be a positive number"]
    },
}, {timestamps: true})

// One budget per category for each user
BudgetSchema.index({user: 1, category: 1}, {unique: true})

module.exports = mongoose.model('Budget', BudgetSchema)
