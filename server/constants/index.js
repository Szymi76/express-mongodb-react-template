module.exports.PROVIDERS = {
    LOCAL: 'local',
}

module.exports.VALID_NAME = {
    MAX_LEN: 16,
    MIN_LEN: 3,
}

module.exports.VALID_PASSWORD = {
    MIN_LEN: 4,
    MAX_LEN: 60,
}

module.exports.EXPIRES_IN = {
    // oba w sekundach
    ACCESS_TOKEN: 120,
    REFRESH_TOKEN: 1800,
}
