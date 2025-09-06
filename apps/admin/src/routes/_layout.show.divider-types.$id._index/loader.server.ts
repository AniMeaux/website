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

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const dividerType = await db.show.dividerType.findUniqueWithAvailability(
    routeParams.id,
    {
      select: {
        id: true,
        label: true,
        maxCount: true,

        exhibitors: {
          orderBy: [{ dividerCount: "desc" }, { name: "asc" }],
          select: {
            id: true,
            isVisible: true,
            logoPath: true,
            name: true,
            dividerCount: true,
          },
        },
      },
    },
  );

  return json({ dividerType });
}
