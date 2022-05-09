import Koa, { Middleware } from "koa";
import json from "koa-json";

export function applyJsonMiddleware(app: Koa) {
  app.use(nullBodyMiddleware());
  app.use(json());
}

function nullBodyMiddleware(): Middleware {
  return async function nullBodyMiddleware(context, next) {
    await next();

    if (context.body === null) {
      context.body = "null";
      context.status = 200;
      context.set("Content-Type", "application/json; charset=utf-8");
    }
  };
}
