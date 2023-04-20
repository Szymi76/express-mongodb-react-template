const { User } = require('../../models')
const { isObjectIdOrHexString } = require('mongoose')
const { createAccessToken, accessTokenExpiresAt, createRefreshToken } = require('../../utils/createToken')
const jwt = require('jsonwebtoken')
const transformUser = require('../../utils/transformUser')

/**
 * Odświezanie access_tokena, inaczej wymiana ważnego refresh_tokena na access_token
 */
module.exports = async function (req, res) {
    try {
        const { refresh_token } = req.body
        if (!refresh_token) return res.status(400).json({ message: 'Brakuje refresh tokena' })

        const { _id: userId } = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
        if (!isObjectIdOrHexString(userId))
            return res.status(400).json({ message: 'Token ma błędny payload' })

        const user = await User.findById(userId)
        const result = transformUser(user)
        const access_token = createAccessToken(result)
        const new_refresh_token = createRefreshToken({ _id: result._id })
        const expires_at = accessTokenExpiresAt()

        res.status(200).json({ access_token, refresh_token: new_refresh_token, expires_at })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}
