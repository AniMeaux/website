import { db } from "#core/db.server.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { UserSearchParams } from "#users/searchParams.ts";
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
    managers: await db.user.fuzzySearch({
      displayName: searchParams.displayName,
      groups: [UserGroup.ANIMAL_MANAGER],
      isDisabled: false,
      maxHitCount: 6,
    }),
  });
}
