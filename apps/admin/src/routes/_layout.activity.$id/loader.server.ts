import { Activity } from "#activity/db.server.js";
import { db } from "#core/db.server.js";
import { assertCurrentUserHasGroups } from "#current-user/groups.server.js";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { routeParamsSchema } from "./route-params";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const routeParams = safeParseRouteParam(routeParamsSchema, params);

  const activity = await Activity.findUnique(routeParams.id, {
    select: {
      createdAt: true,
      action: true,

      resource: true,
      resourceId: true,
      animal: {
        select: { id: true, name: true, alias: true, avatar: true },
      },
      fosterFamily: {
        select: { id: true, displayName: true, availability: true },
      },

      actorType: true,
      actorId: true,

      user: {
        select: { id: true, displayName: true },
      },

      before: true,
      after: true,
    },
  });

  return json({ activity });
}
