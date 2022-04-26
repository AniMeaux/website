import { DefaultState } from "koa";
import Router from "koa-router";
import { Context } from "./core/contex";

export const healthRouter = new Router<DefaultState, Context>();

healthRouter.get("/healthcheck", async (context, next) => {
  context.body = "OK";
  context.status = 200;
  return next();
});
