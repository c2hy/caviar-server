const redis = require("redis");
const { redisPassword } = require("./config")

const { promisify } = require("util");
const client = redis.createClient({ host: "1.15.226.74", password: redisPassword })
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
    HSET: promisify(client.HSET).bind(client),
    HGET: promisify(client.HGET).bind(client),
    HDEL: promisify(client.HDEL).bind(client),
    HGETALL: promisify(client.HGETALL).bind(client),
    ZREVRANGE: promisify(client.ZREVRANGE).bind(client),
    SMEMBERS: promisify(client.SMEMBERS).bind(client),
};
