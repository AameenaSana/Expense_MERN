const mongoose = require('mongoose');


const IncomeSchema = new mongoose.Schema({
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
        default:"income"
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxLength: [20, "Description must be at most 20 characters"],
        trim: true
    },
}, {timestamps: true})

module.exports = mongoose.model('Income', IncomeSchema)
