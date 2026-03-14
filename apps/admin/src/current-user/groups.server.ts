import type { User, UserGroup } from "@animeaux/prisma/server";

import { forbidden } from "#i/core/response.server";
import { hasGroups } from "#i/users/groups";

export function assertCurrentUserHasGroups(
  user: Pick<User, "groups">,
  groups: UserGroup[],
) {
  if (!hasGroups(user, groups)) {
    throw forbidden();
  }
}
