const mongoose = require('mongoose')

const router = require('express').Router();

// Used by the hosting platform to check the app is up and connected to the database
router.get('/health', (req, res) => {
    const connected = mongoose.connection.readyState === 1
    res.status(connected ? 200 : 503).json({status: connected ? 'ok' : 'database unavailable'})
})

module.exports = router
