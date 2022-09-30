import { createCookieSessionStorage, Session } from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    // 7 days.
    maxAge: 60 * 60 * 24 * 7,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request?: Request) {
  const cookie = request?.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function commitSession(session: Session) {
  return await sessionStorage.commitSession(session);
}

export async function destroySession(session: Session) {
  return await sessionStorage.destroySession(session);
}
