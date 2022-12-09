import { hasGroups } from "@animeaux/shared";
import { User, UserGroup } from "@prisma/client";
import { ForbiddenResponse } from "~/core/response.server";

export function assertCurrentUserHasGroups(
  user: Pick<User, "groups">,
  groups: UserGroup[]
) {
  if (!hasGroups(user, groups)) {
    throw new ForbiddenResponse();
  }
}
