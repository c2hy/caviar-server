const { ClientV3: Client } = require("@camaro/redis");
const reidsConfig = process.env.NODE_ENV === "prod" ? { password: "suzor" } : { password: "123456" }
exports.redisClient = new Client(reidsConfig);
