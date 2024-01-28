import { db } from "#core/db.server.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { FosterFamilySearchParams } from "#fosterFamilies/searchParams.ts";
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

  const searchParams = FosterFamilySearchParams.parse(
    new URL(request.url).searchParams,
  );

  return json({
    fosterFamilies: await db.fosterFamily.fuzzySearch({
      displayName: searchParams.displayName,
      // Use 5 instead of 6 to save space for the additional item.
      maxHitCount: 5,
    }),
  });
}
