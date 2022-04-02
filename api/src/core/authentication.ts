import { doesGroupsIntersect, User, UserGroup } from "@animeaux/shared";
import { OperationError } from "./operations";

export function assertHasUser(
  user: User | null | undefined
): asserts user is User {
  if (user == null) {
    throw new OperationError(401);
  }
}

export function userHasGroups(
  user: User | null | undefined,
  groups: UserGroup[]
): user is User {
  if (user == null) {
    return false;
  }

  return doesGroupsIntersect(user.groups, groups);
}

export function assertUserHasGroups(
  user: User | null | undefined,
  groups: UserGroup[]
): asserts user is User {
  if (user == null) {
    throw new OperationError(401);
  }

  if (!doesGroupsIntersect(user.groups, groups)) {
    throw new OperationError(403);
  }
}
