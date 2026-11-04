const mongoose = require('mongoose');

const db = async () => {
    if (!process.env.MONGO_URL) {
        console.error('MONGO_URL is not set. Add it to backend/.env');
        process.exit(1);
    }
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Db Connected')
    } catch (error) {
        console.error('DB Connection Error:', error.message);
        process.exit(1);
    }
}

module.exports = {db}
