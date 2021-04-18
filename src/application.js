const Router = require("koa-router");
const { redisClient } = require("./infrastructure");
const { DateTime } = require("luxon");
const { v4: uuid } = require('uuid');
const { bcryptSaltRounds, jwtSecret } = require("./config")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = new Router();

router.post("/new-user", async (ctx) => {
  const { nickName, avatar, password: passwordText } = ctx.request.body
  const userId = (await redisClient.INCR("uid")).toString(32)
  const password = await bcrypt.hash(passwordText, bcryptSaltRounds)
  await redisClient.SET(`user:${userId}`, JSON.stringify({ userId, nickName, avatar, password }))
  ctx.body = { userId }
})

router.post("/new-token", async (ctx) => {
  const { userId, password: passwordText } = ctx.request.body
  const user = await redisClient.GET(`user:${userId}`).then(v => JSON.parse(v))
  if (await bcrypt.compare(passwordText, user.password)) {
    ctx.cookies.set("access_token", jwt.sign({ data: userId }, jwtSecret, { expiresIn: "30d" }))
    ctx.body = { result: "success" }
  } else {
    ctx.body = { result: "error credential" }
  }
})

router.post("/new-moment", async (ctx) => {
  const userId = ctx.request.userId
  const { content } = ctx.request.body;
  const momentId = uuid();
  const createdTime = DateTime.now().toMillis();
  await redisClient.SET(`moment:${momentId}`, JSON.stringify({ momentId, content, createdTime }))
  await redisClient.ZADD(`user:moment:${userId}`, createdTime, momentId)
  ctx.body = { momentId };
})

router.post("/remove-moment", async (ctx) => {
  const userId = ctx.request.userId
  const { momentId } = ctx.request.body;
  await redisClient.ZREM(`user:moment:${userId}`, momentId)
  ctx.body = {};
})

router.post("/new-friend", async (ctx) => {
  const userId = ctx.request.userId
  const { friendUserId } = ctx.request.body;
  const result = await redisClient.SADD(`user:friend:${userId}:unique`, friendUserId);
  if (result === 1) {
    const friendId = uuid()
    await redisClient.HSET(`user:friend:${userId}`, friendId, friendUserId)
    ctx.body = { code: "success", friendId }
  } else {
    ctx.body = { code: "unique friend id" };
  }
})

router.post("/remove-friend", async (ctx) => {
  const userId = ctx.request.userId
  const { friendId } = ctx.request.body;
  const friendUserId = await redisClient.HGET(`user:friend:${userId}`, friendId)
  await redisClient.HDEL(`user:friend:${userId}`, friendId)
  await redisClient.SREM(`user:friend:${userId}:unique`, friendUserId);
  ctx.body = {};
})

router.post("/current-user", async (ctx) => {
  const userId = ctx.request.userId
  ctx.body = await redisClient.GET(`user:${userId}`).then(v => JSON.parse(v))
})

const userMoments = async (userId) => {
  const momentIds = await redisClient.ZREVRANGE(`user:moment:${userId}`, 0, 100)
  const momentList = []
  for (const momentId of momentIds) {
    momentList.push(await redisClient.GET(`moment:${momentId}`).then(v => JSON.parse(v)))
  }
  return momentList;
}

router.post("/owner-moments", async (ctx) => {
  const userId = ctx.request.userId;
  ctx.body = await userMoments(userId)
})

router.post("/friend-moments", async (ctx) => {
  const userId = ctx.request.userId;
  const friendId = ctx.request.body.friendId;
  const friendUserId = await redisClient.HGET(`user:friend:${userId}`, friendId)
  ctx.body = await userMoments(friendUserId)
})

const listFriend = async (userId) => {
  const friendIds = await redisClient.HGETALL(`user:friend:${userId}`) || []
  const friendList = []
  for (const friendId in friendIds) {
    const friend = await redisClient.GET(`user:${friendIds[friendId]}`).then(v => JSON.parse(v))
    friend.friendId = friendId
    friendList.push(friend)
  }
  return friendList;
}

router.post("/friends", async (ctx) => {
  const userId = ctx.request.userId
  ctx.body = await listFriend(userId);
});

router.post("/recent", async (ctx) => {
  const userId = ctx.request.userId
  const friendList = await listFriend(userId)
  for (const friend of friendList) {
    const momentId = await redisClient.ZREVRANGE(`user:moment:${friend.userId}`, 0, 0).then(v => v.pop())
    friend.newestMoment = await redisClient.GET(`moment:${momentId}`).then(v => JSON.parse(v))
  }
  ctx.body = friendList
});

module.exports = router;
