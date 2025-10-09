import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import {
  ApplicationSearchParams,
  ApplicationSearchParamsN,
} from "#show/exhibitors/applications/search-params.js";
import {
  ExhibitorSearchParams,
  ExhibitorSearchParamsN,
} from "#show/exhibitors/search-params.js";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";
import { RouteParamsSchema } from "./route-params";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const {
    standSize,
    exhibitors: { exhibitors, totalCount: exhibitorTotalCount },
    applications: { applications, totalCount: applicationTotalCount },
  } = await promiseHash({
    standSize: db.show.standSize.findUniqueWithAvailability(routeParams.id, {
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
    }),

    exhibitors: db.show.exhibitor.findMany({
      searchParams: ExhibitorSearchParams.parse(
        ExhibitorSearchParams.create({
          sort: ExhibitorSearchParamsN.Sort.NAME,
          standSizesId: new Set([routeParams.id]),
        }),
      ),
      page: 0,
      countPerPage: 6,
      select: {
        id: true,
        isVisible: true,
        logoPath: true,
        name: true,
      },
    }),

    applications: db.show.exhibitor.application.findMany({
      searchParams: ApplicationSearchParams.parse(
        ApplicationSearchParams.create({
          sort: ApplicationSearchParamsN.Sort.CREATED_AT,
          standSizesId: new Set([routeParams.id]),
        }),
      ),
      pagination: { page: 0, countPerPage: 6 },
      select: {
        createdAt: true,
        id: true,
        status: true,
        structureName: true,
      },
    }),
  });

  return json({
    standSize,
    exhibitors,
    exhibitorTotalCount,
    applications,
    applicationTotalCount,
  });
}
