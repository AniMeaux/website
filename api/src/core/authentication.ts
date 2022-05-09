import { CurrentUser, hasGroups, UserGroup } from "@animeaux/shared";
import { OperationError } from "./operations";

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
