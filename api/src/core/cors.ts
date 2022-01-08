import cors from "@koa/cors";
import { DefaultState, Middleware } from "koa";
import { Context } from "./contex";

const ALLOWED_ORIGINS = [/^https:\/\/.*\.animeaux\.org$/];

if (process.env.NODE_ENV === "development") {
  ALLOWED_ORIGINS.push(/^http:\/\/localhost/);
}

export function corsMiddleware(): Middleware<DefaultState, Context> {
  return cors({
    origin: (context) => {
      const requestOrigin = context.get("Origin");

      if (
        requestOrigin != null &&
        ALLOWED_ORIGINS.some((origin) => origin.test(requestOrigin))
      ) {
        return requestOrigin;
      }

      return "";
    },
  });
}
