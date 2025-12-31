import { db } from "#i/core/db.server.js";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server.js";
import { UserGroup } from "@animeaux/prisma/server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const standSizes = await db.show.standSize.findManyWithAvailability({
    select: {
      id: true,
      label: true,
      isVisible: true,
    },
  });

  return json({ standSizes });
}
