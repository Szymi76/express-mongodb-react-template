const jwt = require('jsonwebtoken')
const { EXPIRES_IN } = require('../constants')

module.exports.createAccessToken = function (payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: EXPIRES_IN.ACCESS_TOKEN }) // 30 sekund
}

module.exports.createRefreshToken = function (payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: EXPIRES_IN.REFRESH_TOKEN }) // 30 sekund
}

module.exports.accessTokenExpiresAt = function () {
    return +(new Date().getTime() / 1000 + EXPIRES_IN.ACCESS_TOKEN).toFixed()
}

module.exports.refreshTokenExpiresAt = function () {
    return +(new Date().getTime() / 1000 + EXPIRES_IN.REFRESH_TOKEN).toFixed()
}
