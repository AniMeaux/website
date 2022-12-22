import {
  commitSession,
  destroySession,
  getSession,
} from "#/core/session.server";
import { User } from "@prisma/client";

const USER_SESSION_KEY = "userId";

export async function createUserSession(userId: User["id"]) {
  const session = await getSession();
  session.set(USER_SESSION_KEY, userId);
  return await commitSession(session);
}

export async function destroyUserSession() {
  const session = await getSession();
  return await destroySession(session);
}
