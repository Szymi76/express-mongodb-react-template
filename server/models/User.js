const mongoose = require('mongoose')
const { PROVIDERS, VALID_NAME, VALID_PASSWORD } = require('../constants')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minLenght: VALID_NAME.MIN_LEN,
            maxLength: VALID_NAME.MAX_LEN,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: true,
        },
        avatarUrl: String,
        password: {
            type: String,
            minLength: VALID_PASSWORD.MIN_LEN,
            maxLength: VALID_PASSWORD.MAX_LEN,
            select: false,
            required: true,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        provider: {
            type: String,
            default: PROVIDERS.LOCAL,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports.User = mongoose.model('User', userSchema)
