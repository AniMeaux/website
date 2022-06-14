import { CurrentUser, hasGroups } from "@animeaux/shared";
import { UserGroup } from "@prisma/client";
import { ParameterizedContext } from "koa";
import { mapCurrentUser } from "../entities/currentUser.entity";
import { prisma } from "./db";
import { OperationError } from "./operations";
import { getUserIdFromSession } from "./session";

export async function getCurrentUser(
  context: ParameterizedContext
): Promise<CurrentUser | null> {
  const userId = await getUserIdFromSession(context);
  if (userId == null) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user == null || user.isDisabled) {
    return null;
  }

  return mapCurrentUser(user);
}

export function assertDontHaveUser(
  user: CurrentUser | null | undefined
): asserts user is null | undefined {
  if (user != null) {
    throw new OperationError(400);
  }
}

export function assertHasUser(
  user: CurrentUser | null | undefined
): asserts user is CurrentUser {
  if (user == null) {
    throw new OperationError(401);
  }
}

export function userHasGroups(
  user: CurrentUser | null | undefined,
  groups: UserGroup[]
): user is CurrentUser {
  if (user == null) {
    return false;
  }

  return hasGroups(user, groups);
}

export function assertUserHasGroups(
  user: CurrentUser | null | undefined,
  groups: UserGroup[]
): asserts user is CurrentUser {
  assertHasUser(user);

  if (!hasGroups(user, groups)) {
    throw new OperationError(403);
  }
}
