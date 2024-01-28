import { db } from "#core/db.server.ts";
import { ForbiddenResponse } from "#core/response.server.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import {
  Entity,
  GlobalSearchParams,
  SORTED_ENTITIES,
} from "#routes/resources.global-search/shared";
import type { User } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

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
  const entity =
    searchParams.entity ??
    SORTED_ENTITIES.find((entity) => possibleEntities.has(entity));

  if (entity == null || !possibleEntities.has(entity)) {
    throw new ForbiddenResponse();
  }

  if (searchParams.text == null) {
    return json({
      possibleEntities: Array.from(possibleEntities),
      items: [],
    });
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
    return json({
      possibleEntities: Array.from(possibleEntities),
      items,
    });
  }

  const fosterFamilies = await db.fosterFamily.fuzzySearch({
    displayName: searchParams.text,
    maxHitCount: MAX_HIT_COUNT,
  });

  const items = fosterFamilies.map((fosterFamily) => ({
    type: Entity.FOSTER_FAMILY as const,
    ...fosterFamily,
  }));

  return json({
    possibleEntities: Array.from(possibleEntities),
    items,
  });
}

function getPossibleEntitiesForCurrentUser(currentUser: Pick<User, "groups">) {
  const possibleEntities = new Set<Entity>();
  currentUser.groups.forEach((group) => {
    ALLOWED_ENTITIES_PER_GROUP[group].forEach((entity) =>
      possibleEntities.add(entity),
    );
  });
  return possibleEntities;
}

const ALLOWED_ENTITIES_PER_GROUP: Record<UserGroup, Set<Entity>> = {
  [UserGroup.ADMIN]: new Set([Entity.ANIMAL, Entity.FOSTER_FAMILY]),
  [UserGroup.ANIMAL_MANAGER]: new Set([Entity.ANIMAL, Entity.FOSTER_FAMILY]),
  [UserGroup.BLOGGER]: new Set(),
  [UserGroup.HEAD_OF_PARTNERSHIPS]: new Set(),
  [UserGroup.VETERINARIAN]: new Set([Entity.ANIMAL]),
  [UserGroup.VOLUNTEER]: new Set([Entity.ANIMAL]),
};
