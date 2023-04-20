module.exports = function (user) {
    const { _id, name, email, avatarUrl, provider, emailVerified, active, createdAt } = user

    return {
        _id: _id.toString(),
        name,
        email,
        avatarUrl,
        provider,
        emailVerified,
        active,
        createdAt,
    }
}
