import {
  createCookie,
  createCookieSessionStorage,
  Session,
} from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const sessionCookie = createCookie("_session", {
  httpOnly: true,
  path: "/",
  sameSite: "strict",
  // 2 weeks.
  maxAge: 60 * 60 * 24 * 7 * 2,
  secrets: [process.env.SESSION_SECRET],
  secure: process.env.NODE_ENV === "production",
});

const sessionStorage = createCookieSessionStorage({ cookie: sessionCookie });

export async function getSession(request?: Request) {
  const cookie = request?.headers.get("cookie");
  return await sessionStorage.getSession(cookie);
}

export async function commitSession(session: Session) {
  return await sessionStorage.commitSession(session);
}

export async function destroySession(session: Session) {
  return await sessionStorage.destroySession(session);
}

export async function extendSession(
  requestHeaders: Headers,
  responseHeaders: Headers
) {
  const setCookieValue = await sessionCookie.parse(
    responseHeaders.get("set-cookie")
  );

  if (setCookieValue == null) {
    const cookieValue = await sessionCookie.parse(requestHeaders.get("cookie"));
    if (cookieValue != null) {
      responseHeaders.append(
        "Set-Cookie",
        await sessionCookie.serialize(cookieValue)
      );
    }
  }
}
