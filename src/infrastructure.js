const { ClientV3: Client } = require("@camaro/redis");
exports.redisClient = new Client({ password: "123456" });
