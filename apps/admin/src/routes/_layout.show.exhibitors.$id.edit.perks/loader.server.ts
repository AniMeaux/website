import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { RouteParamsSchema } from "./route-params.js";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await db.show.exhibitor.findUnique(routeParams.id, {
    select: {
      breakfastPeopleCountSaturday: true,
      breakfastPeopleCountSunday: true,
      category: true,
      hasCorner: true,
      hasTableCloths: true,
      name: true,
      peopleCount: true,
      perksStatus: true,
      perksStatusMessage: true,
      tableCount: true,

      size: {
        select: {
          id: true,
          label: true,
          maxPeopleCount: true,
          priceForAssociations: true,
          priceForServices: true,
          priceForShops: true,
        },
      },
    },
  });

  return json({ exhibitor });
}
