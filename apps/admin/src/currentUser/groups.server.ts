import { ForbiddenResponse } from "#/core/response.server";
import { hasGroups } from "#/users/groups";
import { User, UserGroup } from "@prisma/client";

export function assertCurrentUserHasGroups(
  user: Pick<User, "groups">,
  groups: UserGroup[]
) {
  if (!hasGroups(user, groups)) {
    throw new ForbiddenResponse();
  }
}
