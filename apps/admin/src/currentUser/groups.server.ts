import { ForbiddenResponse } from "#core/response.server.ts";
import { hasGroups } from "#users/groups.tsx";
import type { User, UserGroup } from "@prisma/client";

export function assertCurrentUserHasGroups(
  user: Pick<User, "groups">,
  groups: UserGroup[],
) {
  if (!hasGroups(user, groups)) {
    throw new ForbiddenResponse();
  }
}
