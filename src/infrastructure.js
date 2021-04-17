const { ClientV2: Client } = require("@camaro/redis");
const reidsConfig = process.env.NODE_ENV === "prod" ? { password: process.env.REDIS_PASSWORD } : { password: "123456" }
exports.redisClient = new Client(reidsConfig);
