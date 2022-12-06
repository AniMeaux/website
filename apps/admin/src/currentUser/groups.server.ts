import { hasGroups } from "@animeaux/shared";
import { User, UserGroup } from "@prisma/client";

export function assertCurrentUserHasGroups(
  user: Pick<User, "groups">,
  groups: UserGroup[]
) {
  if (!hasGroups(user, groups)) {
    throw new Response("Forbidden", { status: 403 });
  }
}
