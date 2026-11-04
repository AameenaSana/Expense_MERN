const mongoose = require('mongoose');

// A monthly spending limit for one expense category
const BudgetSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxLength: [30, "Category must be at most 30 characters"]
    },
    amount: {
        type: Number,
        required: true,
        min: [0.01, "Budget must be a positive number"]
    },
}, {timestamps: true})

module.exports = mongoose.model('Budget', BudgetSchema)
