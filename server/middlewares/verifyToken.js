const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    try {
        const header = req.headers.authorization
        if (!header) return res.status(403).send('Forbidden')

        const access_token = header.split(' ')[1]
        const user = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET)
        req.user = user

        next()
    } catch (err) {
        res.status(403).send('Forbidden')
    }
}
