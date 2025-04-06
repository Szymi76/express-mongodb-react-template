const { User } = require('../../models')
const { isObjectIdOrHexString } = require('mongoose')
const transformUser = require('../../utils/transformUser')

/**
 * Pobieranie konkretnego użytkownika po id
 * [TYLKO DLA ZALOGOWANYCH]
 */
module.exports = async function (req, res) {
    try {
        const { userId } = req.params

        if (!userId) return res.status(400).json({ message: 'Brakuje wymaganych danych' })
        if (!isObjectIdOrHexString(userId))
            return res.status(400).json({ message: 'Podane id jest błędnej struktury' })

        const user = await User.findById(userId).exec()
        if (!user) return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanych id' })
        const result = transformUser(user)

        res.status(200).json({ user: { ...result } })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}
