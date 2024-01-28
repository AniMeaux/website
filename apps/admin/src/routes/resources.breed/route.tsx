import { BreedSearchParams } from "#breeds/searchParams";
import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server";
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

  const searchParams = BreedSearchParams.parse(
    new URL(request.url).searchParams,
  );

  return json({
    breeds: await db.breed.fuzzySearch({
      name: searchParams.name,
      species: searchParams.species,
      maxHitCount: 6,
    }),
  });
}
