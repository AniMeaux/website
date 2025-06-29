import { db } from "#core/db.server";
import { forbidden } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Entity,
  GlobalSearchParams,
  getPossibleEntitiesForCurrentUser,
} from "./shared";

const MAX_HIT_COUNT = 6;

export type loader = typeof loader;

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
    UserGroup.VOLUNTEER,
  ]);

  const searchParams = GlobalSearchParams.parse(
    new URL(request.url).searchParams,
  );

  const possibleEntities = getPossibleEntitiesForCurrentUser(currentUser);
  const entity = searchParams.entity ?? possibleEntities[0];

  if (entity == null || !possibleEntities.includes(entity)) {
    throw forbidden();
  }

  if (searchParams.text == null) {
    return json({ items: [] });
  }

  if (entity === Entity.ANIMAL) {
    const animals = await db.animal.fuzzySearch(searchParams.text, {
      select: {
        alias: true,
        avatar: true,
        breed: { select: { name: true } },
        color: { select: { name: true } },
        name: true,
        pickUpDate: true,
        pickUpLocation: true,
        species: true,
        status: true,
      },
      take: MAX_HIT_COUNT,
    });

    const items = animals.map((animal) => ({
      type: Entity.ANIMAL as const,
      ...animal,
    }));

    return json({ items });
  }

  const fosterFamilies = await db.fosterFamily.fuzzySearch(searchParams.text, {
    select: {
      availability: true,
      city: true,
      displayName: true,
      zipCode: true,
    },
    take: MAX_HIT_COUNT,
  });

  const items = fosterFamilies.map((fosterFamily) => ({
    type: Entity.FOSTER_FAMILY as const,
    ...fosterFamily,
  }));

  return json({ items });
}
