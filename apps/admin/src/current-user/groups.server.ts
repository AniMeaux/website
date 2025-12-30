import { forbidden } from "#i/core/response.server";
import { hasGroups } from "#i/users/groups";
import type { User, UserGroup } from "@animeaux/prisma/server";

export function assertCurrentUserHasGroups(
  user: Pick<User, "groups">,
  groups: UserGroup[],
) {
  if (!hasGroups(user, groups)) {
    throw forbidden();
  }
}
