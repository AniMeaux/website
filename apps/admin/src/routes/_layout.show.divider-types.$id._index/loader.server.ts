import { db } from "#i/core/db.server";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server";
import { ExhibitorSearchParams } from "#i/show/exhibitors/search-params.js";
import { UserGroup } from "@animeaux/prisma/server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
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
      searchParams: ExhibitorSearchParams.io.parse(
        ExhibitorSearchParams.io.create({
          sort: ExhibitorSearchParams.Sort.Enum.DIVIDER_COUNT,
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
