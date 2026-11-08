const rateLimit = require('express-rate-limit')
const { register, login, me } = require('../controllers/auth')
const { requireAuth } = require('../middleware/auth')

const router = require('express').Router();

// Slow down password guessing: 20 login/register attempts per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test',
    message: {message: 'Too many attempts. Please wait a few minutes and try again'},
})

router.post('/auth/register', authLimiter, register)
    .post('/auth/login', authLimiter, login)
    .get('/auth/me', requireAuth, me)

module.exports = router
