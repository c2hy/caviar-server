const Router = require("koa-router");
const { redisClient } = require("./infrastructure");
const { DateTime } = require("luxon");
const { v4: uuid } = require('uuid');

const router = new Router();

router.post("/new-user", async (ctx) => {
  const { nickName, avatar } = ctx.request.body
  const userId = (await redisClient.INCR("uid")).toString(32)
  await redisClient.SET(`user:${userId}`, JSON.stringify({ userId, nickName, avatar }))
  ctx.body = { userId }
})

router.post("/new-moment", async (ctx) => {
  const { userId, content } = ctx.request.body;
  const momentId = uuid();
  const createdTime = DateTime.now().toMillis();
  const base64Content = Buffer.from(content).toString("base64")
  await redisClient.SET(`moment:${momentId}`, JSON.stringify({ momentId, content: base64Content, createdTime }))
  await redisClient.ZADD(`user:moment:${userId}`, createdTime, momentId)
  ctx.body = { momentId };
})

router.post("/remove-moment", async (ctx) => {
  const { userId, momentId } = ctx.request.body;
  await redisClient.ZREM(`user:moment:${userId}`, momentId)
  ctx.body = {};
})

router.post("/new-friend", async (ctx) => {
  const { userId, friendId } = ctx.request.body;
  await redisClient.SADD(`user:friend:${userId}`, friendId);
  ctx.body = {};
})

router.post("/remove-friend", async (ctx) => {
  const { userId, friendId } = ctx.request.body;
  await redisClient.SREM(`user:friend:${userId}`, friendId);
  ctx.body = {};
})

router.post("/current-user", async (ctx) => {
  const userId = ctx.request.body.userId;
  ctx.body = await redisClient.GET(`user:${userId}`).then(v => JSON.parse(v))
})

router.post("/moments", async (ctx) => {
  const userId = ctx.request.body.userId;
  const momentIds = await redisClient.ZREVRANGE(`user:moment:${userId}`, 0, 100)
  const momentList = []
  for (const momentId of momentIds) {
    momentList.push(await redisClient.GET(`moment:${momentId}`).then(v => JSON.parse(v)))
  }
  ctx.body = momentList
})

router.post("/friends", async (ctx) => {
  const { userId } = ctx.request.body
  const friendIds = await redisClient.SMEMBERS(`user:friend:${userId}`)
  const friendList = []
  for (const friendId of friendIds) {
    const friend = await redisClient.GET(`user:${friendId}`)
    friendList.push(JSON.parse(friend))
  }
  ctx.body = friendList;
});

router.post("/recent", async (ctx) => {
  const { userId } = ctx.request.body
  const friendIds = await redisClient.SMEMBERS(`user:friend:${userId}`)
  const friendList = []
  for (const friendId of friendIds) {
    const friend = await redisClient.GET(`user:${friendId}`).then(v => JSON.parse(v))
    const momentId = await redisClient.ZREVRANGE(`user:moment:${friendId}`, 0, 0).then(v => v.pop() || "{}")
    friend.newestMoment = await redisClient.GET(`moment:${momentId}`).then(v => JSON.parse(v))
    friendList.push(friend)
  }
  ctx.body = friendList
});

module.exports = router;
