import { PickUpLocationSearchParams } from "#i/animals/search-params";
import { db } from "#i/core/db.server";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server";
import { MAX_HIT_COUNT } from "#i/routes/resources.pick-up-location/shared";
import { UserGroup } from "@animeaux/prisma";
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

  const searchParams = PickUpLocationSearchParams.parse(
    new URL(request.url).searchParams,
  );

  return json({
    pickUpLocations: await db.pickUpLocation.fuzzySearch(searchParams.text, {
      take: MAX_HIT_COUNT,
    }),
  });
}
