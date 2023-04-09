import { createCookie, createCookieSessionStorage } from "@remix-run/node";
import { createTypedSessionStorage } from "remix-utils";
import { z } from "zod";

const PreferencesSchema = z.object({
  isSideBarCollapsed: z.boolean().catch(false),
});

const sessionCookie = createCookie("preferences", {
  httpOnly: true,
  path: "/",
  sameSite: "strict",
  // 5 weeks.
  maxAge: 60 * 60 * 24 * 7 * 5,
  secure: process.env.NODE_ENV === "production",
});

const sessionStorage = createTypedSessionStorage({
  sessionStorage: createCookieSessionStorage({ cookie: sessionCookie }),
  schema: PreferencesSchema,
});

export async function getCurrentUserPreferences(request?: Request) {
  const cookie = request?.headers.get("cookie");
  const session = await sessionStorage.getSession(cookie);
  return session.data;
}

export async function commitCurrentUserPreferences(
  preferences: z.infer<typeof PreferencesSchema>
) {
  // Create new session with default values.
  const session = await sessionStorage.getSession();
  session.data.isSideBarCollapsed = preferences.isSideBarCollapsed;
  return await sessionStorage.commitSession(session);
}

export async function extendCurrentUserPreferences(
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
