const Router = require("koa-router");
const { DateTime } = require("luxon");
const { redisClient } = require("./infrastructure");
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
  await redisClient.ZADD(`moment:${userId}`, createdTime, JSON.stringify({ momentId, content, createdTime }))
  ctx.body = { momentId };
})

router.post("/remove-moment", async (ctx) => {
  const { userId, momentId } = ctx.request.body;
  await redisClient.ZADD(`moment:${userId}`, createdTime, JSON.stringify({ momentId, moment, createdTime }))
  ctx.body = {};
})

router.post("/new-friend", async (ctx) => {
  const { userId, friendId } = ctx.request.body;
  await redisClient.LPUSH(`friend:${userId}`, friendId);
  ctx.body = {};
})

router.post("/current-user", async (ctx) => {
  const userId = ctx.request.body.userId;
  ctx.body = await redisClient.GET(`user:${userId}`).then(v => JSON.parse(v))
})

router.post("/moments", async (ctx) => {
  const userId = ctx.request.body.userId;
  const moments = await redisClient.ZREVRANGE(`moment:${userId}`, 0, 100)
  ctx.body = moments.map(v => JSON.parse(v))
})

router.post("/friends", async (ctx) => {
  const { userId } = ctx.request.body
  const friendIds = await redisClient.LRANGE(`friend:${userId}`, 0, -1)
  const friendList = []
  for (const friendId of friendIds) {
    const friend = await redisClient.GET(`user:${friendId}`)
    friendList.push(JSON.parse(friend))
  }
  ctx.body = friendList;
});

router.post("/recent", async (ctx) => {
  const { userId } = ctx.request.body
  const friendIds = await redisClient.LRANGE(`friend:${userId}`, 0, -1)
  const friendList = []
  for (const friendId of friendIds) {
    const friend = await redisClient.GET(`user:${friendId}`).then(v => JSON.parse(v))
    const moment = await redisClient.ZREVRANGE(`moment:${friendId}`, 0, 0).then(v => v.pop() || "{}")
    friend.newestMoment = JSON.parse(moment)
    friendList.push(friend)
  }
  ctx.body = friendList
});

module.exports = router;
