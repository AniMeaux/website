import { User } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { createPath } from "history";
import { prisma } from "~/core/db.server";
import { addNext } from "~/core/params";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/core/session.server";

const USER_SESSION_KEY = "userId";

export async function getCurrentUserId(request: Request) {
  const session = await getSession(request);

  const userId = session.get(USER_SESSION_KEY);
  if (typeof userId !== "string") {
    throw await redirectToLogin(request);
  }

  const user = await prisma.user.findFirst({
    where: { id: userId, isDisabled: false },
  });

  if (user == null) {
    throw await redirectToLogin(request);
  }

  return userId;
}

async function redirectToLogin(request: Request) {
  // Remove host from URL.
  const redirectTo = createPath(new URL(request.url));
  const search = addNext(new URLSearchParams(), redirectTo);

  return redirect(
    createPath({ pathname: "/login", search: search.toString() }),
    { headers: { "Set-Cookie": await destroyUserSession() } }
  );
}

export async function createUserSession(userId: User["id"]) {
  const session = await getSession();
  session.set(USER_SESSION_KEY, userId);
  return await commitSession(session);
}

export async function destroyUserSession() {
  const session = await getSession();
  return await destroySession(session);
}
