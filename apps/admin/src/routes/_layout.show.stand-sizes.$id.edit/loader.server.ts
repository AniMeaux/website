import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
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

  const standSize = await db.show.standSize.findUniqueWithAvailability(
    routeParams.id,
    {
      select: {
        area: true,
        id: true,
        isVisible: true,
        label: true,
        maxBraceletCount: true,
        maxCount: true,
        maxDividerCount: true,
        maxPeopleCount: true,
        maxTableCount: true,
        priceForAssociations: true,
        priceForServices: true,
        priceForShops: true,
      },
    },
  );

  return json({ standSize });
}
