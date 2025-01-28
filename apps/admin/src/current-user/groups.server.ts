import { forbidden } from "#core/response.server";
import { hasGroups } from "#users/groups";
import type { User, UserGroup } from "@prisma/client";

export function assertCurrentUserHasGroups(
  user: Pick<User, "groups">,
  groups: UserGroup[],
) {
  if (!hasGroups(user, groups)) {
    throw forbidden();
  }
}
