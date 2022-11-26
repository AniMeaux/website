import { hasGroups } from "@animeaux/shared";
import { Prisma, User, UserGroup } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { createPath } from "history";
import { prisma } from "~/core/db.server";
import { NextSearchParams } from "~/core/searchParams";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/currentUser/session.server";
import { generatePasswordHash, isSamePassword } from "~/users/password.server";

const USER_SESSION_KEY = "userId";

export async function getCurrentUser<T extends Prisma.UserFindFirstArgs>(
  request: Request,
  args: Prisma.SelectSubset<T, Prisma.UserFindFirstArgs>
) {
  const session = await getSession(request);

  const userId = session.get(USER_SESSION_KEY);
  if (typeof userId !== "string") {
    throw await redirectToLogin(request);
  }

  const user = await prisma.user.findFirst<T>({
    ...args,
    where: { id: userId, isDisabled: false },
  });
  if (user == null) {
    throw await redirectToLogin(request);
  }

  return user;
}

async function redirectToLogin(request: Request) {
  // Remove host from URL.
  const redirectTo = createPath(new URL(request.url));
  const searchParams = new NextSearchParams().setNext(redirectTo);

  return redirect(
    createPath({ pathname: "/login", search: searchParams.toString() }),
    { headers: { "Set-Cookie": await destroyUserSession() } }
  );
}

export async function verifyLogin({
  email,
  password,
}: {
  email: User["email"];
  password: string;
}) {
  const user = await prisma.user.findFirst({
    where: { email, isDisabled: false },
    select: { id: true, password: true },
  });

  if (user?.password == null) {
    // Prevent finding out which emails exists through a timing attack.
    // We want to take approximately the same time to respond so we fake a
    // password comparison.
    await isSamePassword(
      "Hello there",
      // "Obiwan Kenobi?"
      "879d5935bab9b03280188c1806cf5ae751579b3342c51e788c43be14e0109ab8b98da03f5fa2cc96c85ca192eda9aaf892cba7ba1fc3b7d1a4a1eb8956a65c53.6a71cc1003ad30a5c6abf0d53baa2c5d"
    );

    return null;
  }

  if (!(await isSamePassword(password, user.password.hash))) {
    return null;
  }

  return user.id;
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

export function assertCurrentUserHasGroups(
  user: Pick<User, "groups">,
  groups: UserGroup[]
) {
  if (!hasGroups(user, groups)) {
    throw new Response("Forbidden", { status: 403 });
  }
}

export async function updateCurrentUserPassword(
  userId: User["id"],
  password: string
) {
  const passwordHash = await generatePasswordHash(password);

  await prisma.password.update({
    where: { userId },
    data: { hash: passwordHash },
  });
}

export class EmailAlreadyUsedError extends Error {}

export async function updateCurrentUserProfile(
  userId: User["id"],
  data: Pick<User, "email" | "displayName">
) {
  try {
    await prisma.user.update({ where: { id: userId }, data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Email already used.
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
      if (error.code === "P2002") {
        throw new EmailAlreadyUsedError();
      }
    }

    throw error;
  }
}
