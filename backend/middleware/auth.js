const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const TOKEN_TTL = '7d'

const secret = () => {
    const value = process.env.JWT_SECRET
    if (!value) throw new Error('JWT_SECRET is not set. Add it to backend/.env')
    return value
}

const signToken = (user) => jwt.sign({sub: String(user._id)}, secret(), {expiresIn: TOKEN_TTL})

// Requires a valid "Authorization: Bearer <token>" header for an existing user.
// Sets req.user to the user's document.
const requireAuth = async (req, res, next) => {
    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({message: 'Please log in to continue'})
    }

    let payload
    try {
        payload = jwt.verify(token, secret())
    } catch {
        return res.status(401).json({message: 'Your session has expired. Please log in again'})
    }

    try {
        const user = await UserModel.findById(payload.sub)
        if (!user) {
            return res.status(401).json({message: 'Account not found. Please log in again'})
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {requireAuth, signToken}
