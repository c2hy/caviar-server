const { redisClient } = require("../src/infrastructure")
const { DateTime } = require("luxon");
const { v4: uuid } = require('uuid');

async function test() {
    const momentId = uuid();
    const createdTime = DateTime.now().toMillis();
    await redisClient.SET(`moment:${momentId}`, JSON.stringify({ momentId, content:"尝试插入中文的内容", createdTime }))
}

test()