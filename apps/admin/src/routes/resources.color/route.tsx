import { ColorSearchParams } from "#colors/searchParams.ts";
import { db } from "#core/db.server.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
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

  const searchParams = ColorSearchParams.parse(
    new URL(request.url).searchParams,
  );

  return json({
    colors: await db.color.fuzzySearch({
      name: searchParams.name,
      maxHitCount: 6,
    }),
  });
}
