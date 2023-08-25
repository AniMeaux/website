import { db } from "#core/db.server.ts";
import { Routes } from "#core/navigation.ts";
import { hasGroups } from "#users/groups.tsx";
import { UserGroup } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  throw redirect(
    hasGroups(currentUser, [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER])
      ? Routes.animals.dashboard.toString()
      : Routes.animals.search.toString()
  );
}
