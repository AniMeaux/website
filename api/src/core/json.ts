import Koa, { DefaultState, Middleware } from "koa";
import json from "koa-json";
import { Context } from "./contex";

export function applyJsonMiddleware(app: Koa<DefaultState, Context>) {
  app.use(nullBodyMiddleware());
  app.use(json());
}

function nullBodyMiddleware(): Middleware<DefaultState, Context> {
  return async function nullBodyMiddleware(context, next) {
    await next();

    if (context.body === null) {
      context.body = "null";
      context.status = 200;
      context.set("Content-Type", "application/json; charset=utf-8");
    }
  };
}
