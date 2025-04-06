const { User } = require('../../models/')
const { createAccessToken, createRefreshToken, accessTokenExpiresAt } = require('../../utils/createToken')
const bcrypt = require('bcrypt')
const transformUser = require('../../utils/transformUser')

/**
 * Tworzenie konta użytkownika za pomocą emailu i hasła
 */
module.exports = async function (req, res) {
    try {
        // destruk. i sprawdzanie czy wymagane dane zostały przekazane
        const { name, email, password, avatarUrl } = req.body
        if (!name || !email | !password) return res.status(400).json({ message: 'Brakuje wymaganych danych' })

        // sprawdzanie czy użytkownik o takim samym adresie email już istnieje
        const existingUser = await User.findOne({ email }).exec()
        if (existingUser)
            return res.status(409).json({ message: 'Użytkownik z takim adresem email już istnieje' })

        // hashowanie hasła i tworzenie nowego konta
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, avatarUrl, password: hashedPassword })

        const payload = transformUser(user)
        const access_token = createAccessToken(payload)
        const refresh_token = createRefreshToken({ _id: payload._id })
        const expires_at = accessTokenExpiresAt()

        res.status(201).json({ access_token, refresh_token, expires_at })
    } catch (err) {
        return res.status(500).json({ message: err })
    }
}
