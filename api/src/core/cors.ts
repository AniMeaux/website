import cors from "@koa/cors";
import { Middleware } from "koa";

const ALLOWED_ORIGINS = [/^https:\/\/.*\.animeaux\.org$/];

if (process.env.NODE_ENV === "development") {
  ALLOWED_ORIGINS.push(/^http:\/\/.*\.animeaux\.localhost/);
}

export function corsMiddleware(): Middleware {
  return cors({
    credentials: true,
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
