import type { User } from "@prisma/client";
import { createCookie, createCookieSessionStorage } from "@remix-run/node";
import { createTypedSessionStorage } from "remix-utils";
import invariant from "tiny-invariant";
import { z } from "zod";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const SessionSchema = z.object({
  userId: z.string().uuid().optional().catch(undefined),
});

const sessionCookie = createCookie("_session", {
  httpOnly: true,
  path: "/",
  sameSite: "strict",
  // 2 weeks.
  maxAge: 60 * 60 * 24 * 7 * 2,
  secrets: [process.env.SESSION_SECRET],
  secure: process.env.NODE_ENV === "production",
});

const sessionStorage = createTypedSessionStorage({
  sessionStorage: createCookieSessionStorage({ cookie: sessionCookie }),
  schema: SessionSchema,
});

export async function getCurrentUserSession(request?: Request) {
  const cookie = request?.headers.get("cookie");
  return await sessionStorage.getSession(cookie);
}

export async function createCurrentUserSession(userId: User["id"]) {
  const session = await getCurrentUserSession();
  session.data.userId = userId;
  return await sessionStorage.commitSession(session);
}

export async function destroyCurrentUserSession() {
  const session = await getCurrentUserSession();
  return await sessionStorage.destroySession(session);
}

export async function extendCurrentUserSession(
  requestHeaders: Headers,
  responseHeaders: Headers,
) {
  const setCookieValue = await sessionCookie.parse(
    responseHeaders.get("set-cookie"),
  );

  if (setCookieValue == null) {
    const cookieValue = await sessionCookie.parse(requestHeaders.get("cookie"));
    if (cookieValue != null) {
      responseHeaders.append(
        "Set-Cookie",
        await sessionCookie.serialize(cookieValue),
      );
    }
  }
}
