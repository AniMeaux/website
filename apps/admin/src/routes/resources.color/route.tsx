import { ColorSearchParams } from "#colors/search-params";
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

  const searchParams = ColorSearchParams.parse(
    new URL(request.url).searchParams,
  );

  return json({
    colors: await db.color.fuzzySearch(searchParams.name, {
      select: { name: true },
      take: 6,
    }),
  });
}
