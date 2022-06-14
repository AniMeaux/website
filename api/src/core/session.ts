import { User } from "@prisma/client";
import cookieSignature from "cookie-signature";
import { SetOption } from "cookies";
import { ParameterizedContext } from "koa";
import invariant from "tiny-invariant";

invariant(
  process.env.SESSION_SECRET != null,
  "SESSION_SECRET must be defined."
);

// Just for type checking.
const SESSION_SECRET = process.env.SESSION_SECRET;

invariant(
  process.env.SESSION_COOKIE_DOMAIN != null,
  "SESSION_COOKIE_DOMAIN must be defined."
);

const COOKIE_NAME = "session";

const COOKIE_OPTIONS: SetOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  // 30 days
  maxAge: 30 * 24 * 60 * 60 * 1000,
  domain: process.env.SESSION_COOKIE_DOMAIN,
};

export async function getUserIdFromSession(context: ParameterizedContext) {
  const session = context.cookies.get(COOKIE_NAME);
  if (session == null) {
    return null;
  }

  return cookieSignature.unsign(session, SESSION_SECRET) || null;
}

export async function setUserIdInSession(
  context: ParameterizedContext,
  userId: User["id"]
) {
  context.cookies.set(
    COOKIE_NAME,
    cookieSignature.sign(userId, SESSION_SECRET),
    COOKIE_OPTIONS
  );
}

export async function deleteSession(context: ParameterizedContext) {
  context.cookies.set(COOKIE_NAME, null, { ...COOKIE_OPTIONS, maxAge: 0 });
}
