const mongoose = require('mongoose')

// Shared handlers for income and expense, which have identical shapes.

exports.addTransaction = (Model, label) => async (req, res) => {
    const {title, amount, category, description, date} = req.body

    //validations
    if (!title || !category || !description || !date) {
        return res.status(400).json({message: 'All fields are required!'})
    }
    const numericAmount = Number(amount)
    if (amount === '' || amount === null || !Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({message: 'Amount must be a positive number!'})
    }
    if (Number.isNaN(new Date(date).getTime())) {
        return res.status(400).json({message: 'Date is invalid!'})
    }

    try {
        const doc = new Model({title, amount: numericAmount, category, description, date})
        await doc.save()
        res.status(200).json({message: `${label} Added`})
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const message = Object.values(error.errors).map((e) => e.message).join(', ')
            return res.status(400).json({message})
        }
        console.error(error)
        res.status(500).json({message: 'Server Error'})
    }
}

exports.getTransactions = (Model) => async (req, res) => {
    try {
        const docs = await Model.find().sort({createdAt: -1})
        res.status(200).json(docs)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteTransaction = (Model, label) => async (req, res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message: 'Invalid id'})
    }
    try {
        const deleted = await Model.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({message: `${label} not found`})
        }
        res.status(200).json({message: `${label} Deleted`})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server Error'})
    }
}
