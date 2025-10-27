import { BreedSearchParams } from "#breeds/search-params";
import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
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

  const searchParams = BreedSearchParams.parse(
    new URL(request.url).searchParams,
  );

  return json({
    breeds: await db.breed.fuzzySearch(searchParams.name, {
      where: {
        species:
          searchParams.species.size === 0
            ? undefined
            : { in: Array.from(searchParams.species) },
      },
      select: {
        name: true,
        species: true,
      },
      take: 6,
    }),
  });
}
