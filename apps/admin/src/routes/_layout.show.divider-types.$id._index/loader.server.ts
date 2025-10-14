import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
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
    dividerType,
    exhibitors: { exhibitors, totalCount: exhibitorTotalCount },
  } = await promiseHash({
    dividerType: db.show.dividerType.findUniqueWithAvailability(
      routeParams.id,
      {
        select: {
          id: true,
          label: true,
          maxCount: true,
        },
      },
    ),

    exhibitors: db.show.exhibitor.findMany({
      searchParams: ExhibitorSearchParams.parse(
        ExhibitorSearchParams.create({
          sort: ExhibitorSearchParamsN.Sort.DIVIDER_COUNT,
          dividerTypesId: new Set([routeParams.id]),
        }),
      ),
      pagination: { page: 0, countPerPage: 6 },
      select: {
        id: true,
        isVisible: true,
        logoPath: true,
        name: true,
        dividerCount: true,
      },
    }),
  });

  return json({ dividerType, exhibitors, exhibitorTotalCount });
}
