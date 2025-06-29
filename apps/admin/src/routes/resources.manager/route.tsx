import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { UserSearchParams } from "#users/search-params";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export type loader = typeof loader;

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const searchParams = UserSearchParams.parse(
    new URL(request.url).searchParams,
  );

  return json({
    managers: await db.user.fuzzySearch(searchParams.displayName, {
      where: {
        groups: { hasSome: [UserGroup.ANIMAL_MANAGER] },
        isDisabled: false,
      },
      select: {
        displayName: true,
        groups: true,
        isDisabled: true,
      },
      take: 6,
    }),
  });
}
