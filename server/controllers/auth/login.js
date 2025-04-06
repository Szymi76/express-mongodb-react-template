const { User } = require('../../models')
const { createAccessToken, createRefreshToken, accessTokenExpiresAt } = require('../../utils/createToken')
const bcrypt = require('bcrypt')
const transformUser = require('../../utils/transformUser')
/**
 * Logowanie użytkownika za pomocą emailu i hasła
 */
module.exports = async function (req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ message: 'Brakuje wymaganych danych' })

        const user = await User.findOne({ email }).select('+password').exec()
        if (!user) return res.status(404).json({ message: 'Użytkownik z takim adresem email nie istnieje' })

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) return res.status(400).json({ message: 'Błędne hasło lub adres email' })

        delete user.password

        const payload = transformUser(user)
        const access_token = createAccessToken(payload)
        const refresh_token = createRefreshToken({ _id: payload._id })
        const expires_at = accessTokenExpiresAt()

        res.status(201).json({ access_token, refresh_token, expires_at })
    } catch (err) {
        return res.status(500).json({ message: err })
    }
}
