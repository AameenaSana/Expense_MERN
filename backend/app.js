const path = require('path');
// Load .env from this folder regardless of the directory the server is started from
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express')
const cors = require('cors');
const { db } = require('./db/db');
const {readdirSync} = require('fs')
const app = express()

const PORT = process.env.PORT || 5000

//middlewares
app.use(express.json())
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

const server = async () => {
    await db()
    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    })
}

server()
