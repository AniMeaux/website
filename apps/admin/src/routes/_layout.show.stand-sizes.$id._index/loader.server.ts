import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { RouteParamsSchema } from "./route-params";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const standSize = await db.show.standSize.findUniqueWithAvailability(
    routeParams.id,
    {
      select: {
        area: true,
        id: true,
        isRestrictedByActivityField: true,
        isVisible: true,
        label: true,
        maxCount: true,
        maxDividerCount: true,
        maxPeopleCount: true,
        maxTableCount: true,

        exhibitors: {
          select: {
            id: true,
            isVisible: true,
            logoPath: true,
            name: true,
          },
        },
      },
    },
  );

  return json({ standSize });
}
