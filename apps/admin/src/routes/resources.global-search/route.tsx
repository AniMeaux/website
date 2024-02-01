import { db } from "#core/db.server";
import { ForbiddenResponse } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server";
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
    throw new ForbiddenResponse();
  }

  if (searchParams.text == null) {
    return json({ items: [] });
  }

  if (entity === Entity.ANIMAL) {
    const animals = await db.animal.fuzzySearch({
      nameOrAlias: searchParams.text,
      maxHitCount: MAX_HIT_COUNT,
    });

    const items = animals.map((animal) => ({
      type: Entity.ANIMAL as const,
      ...animal,
    }));

    return json({ items });
  }

  const fosterFamilies = await db.fosterFamily.fuzzySearch({
    displayName: searchParams.text,
    maxHitCount: MAX_HIT_COUNT,
  });

  const items = fosterFamilies.map((fosterFamily) => ({
    type: Entity.FOSTER_FAMILY as const,
    ...fosterFamily,
  }));

  return json({ items });
}
