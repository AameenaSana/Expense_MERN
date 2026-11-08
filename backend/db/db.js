const mongoose = require('mongoose');

const db = async (url = process.env.MONGO_URL) => {
    if (!url) {
        console.error('MONGO_URL is not set. Add it to backend/.env');
        process.exit(1);
    }
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(url)
        // Bring indexes in line with the schemas (drops the old global
        // unique index on budget category, now unique per user instead)
        await Promise.all(Object.values(mongoose.models).map((model) => model.syncIndexes()))
        console.log('Db Connected')
    } catch (error) {
        console.error('DB Connection Error:', error.message);
        process.exit(1);
    }
}

module.exports = {db}
