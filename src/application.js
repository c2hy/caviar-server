const Router = require("koa-router");
const { DateTime } = require("luxon");
const { redisClient } = require("./infrastructure");

const router = new Router();

router.post("/", async (ctx) => {
  await redisClient.SET("hello", DateTime.now());
  ctx.body = await redisClient.GET("hello");
});

module.exports = router;
