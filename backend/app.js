const path = require('path');
// Load .env from this folder regardless of the directory the server is started from
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express')
const cors = require('cors');
const { db } = require('./db/db');
const {readdirSync} = require('fs')
const app = express()

const PORT = process.env.PORT || 5000

// Login tokens are signed with this secret; refuse to start without it
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set. Add a long random string to backend/.env (see .env.example)')
    process.exit(1)
}

//middlewares
app.use(express.json({limit: '10kb'}))
app.use(cors())

//routes (resolved relative to this file, so the server can be started from any directory)
const routesDir = path.join(__dirname, 'routes')
readdirSync(routesDir).forEach((route) => app.use('/api/v1', require(path.join(routesDir, route))))

// Unknown API routes should return JSON 404, not the React page
app.use('/api', (req, res) => {
    res.status(404).json({message: 'Not Found'})
})

//connecting backend to the frontend: serve the static React build
const buildDir = path.join(__dirname, '../frontend/build')
app.use(express.static(buildDir));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildDir, "index.html"));
});

// Malformed JSON, oversized bodies and unexpected errors get a JSON response
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500
    if (status >= 500) console.error(err)
    res.status(status).json({message: status === 400 ? 'Invalid request body' : status === 413 ? 'Request body too large' : 'Server Error'})
})

const server = async () => {
    await db()
    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    }).on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use. Stop the other process or set a different PORT in backend/.env`)
        } else {
            console.error('Server error:', error.message)
        }
        process.exit(1)
    })
}

// Only start listening when run directly (tests import the app instead)
if (require.main === module) {
    server()
}

module.exports = app
