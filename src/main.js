const Koa = require("koa");
const cors = require("koa2-cors");
const logger = require("koa-pino-logger");
const router = require("./application");

const app = new Koa();

app.silent = true;
app.use(logger()).use(cors()).use(router.routes()).listen(3000);
