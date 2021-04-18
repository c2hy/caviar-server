const Koa = require("koa");
const koaBody = require("koa-body");
const logger = require("koa-pino-logger");
const router = require("./application");
const { jwtSecret } = require("./config")
const jwt = require('jsonwebtoken');

const app = new Koa();
const blackList = ["/new-user", "/new-token"]

app.silent = true;
app
  .use(logger())
  .use(async (ctx, next) => {
    if (blackList.includes(ctx.path)) { await next() } else {
      const token = ctx.cookies.get("access_token")
      let userId
      try {
        const decoded = jwt.verify(token, jwtSecret)
        userId = decoded.data
      } catch (error) {
        console.warn("invalid token", error)
        ctx.status = 403;
        return;
      }
      ctx.request.userId = userId
      await next();
    }
  })
  .use(koaBody())
  .use(router.routes())
  .listen(3000);
