const bcrypt = require('bcryptjs')
const UserModel = require('../models/UserModel')
const IncomeModel = require('../models/IncomeModel')
const ExpenseModel = require('../models/ExpenseModel')
const BudgetModel = require('../models/BudgetModel')
const { signToken } = require('../middleware/auth')
const { handleError } = require('./transactionHelpers')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN = 8
// bcrypt only uses the first 72 bytes of a password
const PASSWORD_MAX = 72

const normaliseEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '')

const authResponse = (user) => ({token: signToken(user), user})

// Data created before accounts existed has no owner. The first account to
// register adopts it, so an existing single-user install keeps its data.
const adoptUnownedData = async (userId) => {
    const unowned = {user: {$exists: false}}
    await Promise.all([
        IncomeModel.updateMany(unowned, {user: userId}),
        ExpenseModel.updateMany(unowned, {user: userId}),
        BudgetModel.updateMany(unowned, {user: userId}),
    ])
}

exports.register = async (req, res) => {
    const {name, password} = req.body || {}
    const email = normaliseEmail(req.body && req.body.email)
    const errors = []

    if (typeof name !== 'string' || !name.trim()) errors.push('Name is required')
    else if (name.trim().length > 50) errors.push('Name must be at most 50 characters')
    if (!EMAIL_RE.test(email) || email.length > 254) errors.push('A valid email is required')
    if (typeof password !== 'string' || password.length < PASSWORD_MIN) {
        errors.push(`Password must be at least ${PASSWORD_MIN} characters`)
    } else if (Buffer.byteLength(password) > PASSWORD_MAX) {
        errors.push(`Password must be at most ${PASSWORD_MAX} characters`)
    }
    if (errors.length) {
        return res.status(400).json({message: errors.join('. ')})
    }

    try {
        if (await UserModel.exists({email})) {
            return res.status(409).json({message: 'An account with this email already exists'})
        }
        const isFirstUser = (await UserModel.estimatedDocumentCount()) === 0
        const hash = await bcrypt.hash(password, 12)
        const user = await new UserModel({name: name.trim(), email, password: hash}).save()
        if (isFirstUser) await adoptUnownedData(user._id)
        res.status(201).json(authResponse(user))
    } catch (error) {
        // Two sign-ups with the same email at the same moment
        if (error && error.code === 11000) {
            return res.status(409).json({message: 'An account with this email already exists'})
        }
        handleError(res, error)
    }
}

exports.login = async (req, res) => {
    const email = normaliseEmail(req.body && req.body.email)
    const password = req.body && req.body.password
    if (!email || typeof password !== 'string' || !password) {
        return res.status(400).json({message: 'Email and password are required'})
    }

    try {
        const user = await UserModel.findOne({email}).select('+password')
        // Same message for unknown email and wrong password, so accounts can't be probed
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({message: 'Incorrect email or password'})
        }
        res.status(200).json(authResponse(user))
    } catch (error) {
        handleError(res, error)
    }
}

exports.me = (req, res) => {
    res.status(200).json({user: req.user})
}
