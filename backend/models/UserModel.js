const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: [50, "Name must be at most 50 characters"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        maxLength: [254, "Email is too long"]
    },
    // bcrypt hash; never returned from queries unless explicitly selected
    password: {
        type: String,
        required: true,
        select: false
    },
}, {timestamps: true})

// Never leak the password hash in API responses
UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password
        delete ret.__v
        return ret
    }
})

module.exports = mongoose.model('User', UserSchema)
