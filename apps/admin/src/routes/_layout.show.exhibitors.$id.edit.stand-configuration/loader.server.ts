import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";
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

  const { exhibitor, standSizes, dividerTypes } = await promiseHash({
    exhibitor: db.show.exhibitor.findUnique(routeParams.id, {
      select: {
        breakfastPeopleCountSaturday: true,
        breakfastPeopleCountSunday: true,
        category: true,
        chairCount: true,
        dividerCount: true,
        dividerType: { select: { id: true } },
        hasCorner: true,
        hasElectricalConnection: true,
        hasTableCloths: true,
        installationDay: true,
        name: true,
        peopleCount: true,
        size: { select: { id: true } },
        standConfigurationStatus: true,
        standConfigurationStatusMessage: true,
        tableCount: true,
      },
    }),

    standSizes: db.show.standSize.findManyWithAvailability({
      select: {
        id: true,
        label: true,
        priceForAssociations: true,
        priceForServices: true,
        priceForShops: true,
      },
    }),

    dividerTypes: db.show.dividerType.findManyWithAvailability({
      select: { id: true, label: true },
    }),
  });

  return json({ exhibitor, standSizes, dividerTypes });
}
