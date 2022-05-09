import Router from "koa-router";

export const healthRouter = new Router();

healthRouter.get("/healthcheck", async (context, next) => {
  context.body = "OK";
  context.status = 200;
  return next();
});
