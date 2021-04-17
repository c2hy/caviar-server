const redis = require("redis");
const { promisify } = require("util");
const client = redis.createClient(process.env.NODE_ENV === "prod" ? { password: process.env.REDIS_PASSWORD } : { password: "123456" })
client.on("error", function (error) {
    console.error(error);
});

exports.redisClient = {
    SET: promisify(client.SET).bind(client),
    GET: promisify(client.GET).bind(client),
    ZADD: promisify(client.ZADD).bind(client),
    ZREM: promisify(client.ZREM).bind(client),
    SADD: promisify(client.SADD).bind(client),
    SREM: promisify(client.SREM).bind(client),
    ZREVRANGE: promisify(client.ZREVRANGE).bind(client),
    SMEMBERS: promisify(client.SMEMBERS).bind(client),
};
