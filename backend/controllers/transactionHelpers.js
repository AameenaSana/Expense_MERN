const mongoose = require('mongoose')

// Shared handlers for income and expense, which have identical shapes.

const LIMITS = {
    title: 50,
    category: 30,
    description: 200,
    maxAmount: 1e12,
}

// Validate and normalise a request body. Returns {errors, value}.
const validateTransaction = (body = {}) => {
    const {title, amount, category, description, date} = body
    const errors = []

    if (typeof title !== 'string' || !title.trim()) {
        errors.push('Title is required')
    } else if (title.trim().length > LIMITS.title) {
        errors.push(`Title must be at most ${LIMITS.title} characters`)
    }

    const numericAmount = Number(amount)
    if (amount === '' || amount === null || amount === undefined || !Number.isFinite(numericAmount) || numericAmount <= 0) {
        errors.push('Amount must be a positive number')
    } else if (numericAmount > LIMITS.maxAmount) {
        errors.push('Amount is too large')
    }

    if (typeof category !== 'string' || !category.trim()) {
        errors.push('Category is required')
    } else if (category.trim().length > LIMITS.category) {
        errors.push(`Category must be at most ${LIMITS.category} characters`)
    }

    if (!date || Number.isNaN(new Date(date).getTime())) {
        errors.push('A valid date is required')
    }

    if (description !== undefined && description !== null && typeof description !== 'string') {
        errors.push('Note must be text')
    } else if (description && description.trim().length > LIMITS.description) {
        errors.push(`Note must be at most ${LIMITS.description} characters`)
    }

    return {
        errors,
        value: {
            title: typeof title === 'string' ? title.trim() : title,
            amount: Math.round(numericAmount * 100) / 100,
            category: typeof category === 'string' ? category.trim() : category,
            description: typeof description === 'string' ? description.trim() : '',
            date: new Date(date),
        },
    }
}

const handleError = (res, error) => {
    if (error instanceof mongoose.Error.ValidationError) {
        const message = Object.values(error.errors).map((e) => e.message).join('. ')
        return res.status(400).json({message})
    }
    console.error(error)
    res.status(500).json({message: 'Server Error'})
}

const validId = (res, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({message: 'Invalid id'})
        return false
    }
    return true
}

exports.addTransaction = (Model, label) => async (req, res) => {
    const {errors, value} = validateTransaction(req.body)
    if (errors.length) {
        return res.status(400).json({message: errors.join('. ')})
    }
    try {
        const doc = await new Model({...value, user: req.user._id}).save()
        res.status(200).json({message: `${label} Added`, data: doc})
    } catch (error) {
        handleError(res, error)
    }
}

exports.getTransactions = (Model) => async (req, res) => {
    try {
        const docs = await Model.find({user: req.user._id}).sort({date: -1, createdAt: -1})
        res.status(200).json(docs)
    } catch (error) {
        handleError(res, error)
    }
}

exports.updateTransaction = (Model, label) => async (req, res) => {
    const {id} = req.params
    if (!validId(res, id)) return
    const {errors, value} = validateTransaction(req.body)
    if (errors.length) {
        return res.status(400).json({message: errors.join('. ')})
    }
    try {
        // Scoped to the owner, so other users' entries are reported as not found
        const doc = await Model.findOneAndUpdate({_id: id, user: req.user._id}, value, {new: true, runValidators: true})
        if (!doc) {
            return res.status(404).json({message: `${label} not found`})
        }
        res.status(200).json({message: `${label} Updated`, data: doc})
    } catch (error) {
        handleError(res, error)
    }
}

exports.deleteTransaction = (Model, label) => async (req, res) => {
    const {id} = req.params
    if (!validId(res, id)) return
    try {
        const deleted = await Model.findOneAndDelete({_id: id, user: req.user._id})
        if (!deleted) {
            return res.status(404).json({message: `${label} not found`})
        }
        res.status(200).json({message: `${label} Deleted`})
    } catch (error) {
        handleError(res, error)
    }
}

exports.handleError = handleError
exports.LIMITS = LIMITS
