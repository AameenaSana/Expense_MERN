const mongoose = require('mongoose');


const ExpenseSchema = new mongoose.Schema({
    // Owner of this entry
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: [50, "Title must be at most 50 characters"]
    },
    amount: {
        type: Number,
        required: true,
        min: [0.01, "Amount must be a positive number!"]
    },
    type: {
        type: String,
        default:"expense"
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        maxLength: [30, "Category must be at most 30 characters"]
    },
    // Optional note
    description: {
        type: String,
        default: '',
        maxLength: [200, "Note must be at most 200 characters"],
        trim: true
    },
}, {timestamps: true})

// Lists are fetched per user, newest first
ExpenseSchema.index({user: 1, date: -1})

module.exports = mongoose.model('Expense', ExpenseSchema)
