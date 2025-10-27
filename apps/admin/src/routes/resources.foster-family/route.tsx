import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { FosterFamilySearchParams } from "#foster-families/search-params";
import { UserGroup } from "@animeaux/prisma/client";
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
    fosterFamilies: await db.fosterFamily.fuzzySearch(
      searchParams.displayName,
      {
        where: { isBanned: false },
        select: {
          availability: true,
          city: true,
          displayName: true,
          zipCode: true,
        },
        // Use 5 instead of 6 to save space for the additional item.
        take: 5,
      },
    ),
  });
}
