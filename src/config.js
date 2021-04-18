const selectConf = (productionConf, developmentConf) => {
    return process.env.NODE_ENV === "prod" ? process.env["REDIS_PASSWORD"] : developmentConf
}

module.exports = {
    redisPassword: selectConf("REDIS_PASSWORD", "123456"),
    jwtSecret: selectConf("JWT_SECRET", "yoyo"),
    bcryptSaltRounds: 13
}