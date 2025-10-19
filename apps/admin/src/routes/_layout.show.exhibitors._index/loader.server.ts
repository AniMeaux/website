import { db } from "#core/db.server";
import { PageSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { ExhibitorSearchParams } from "#show/exhibitors/search-params";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";

const EXHIBITOR_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const searchParams = new URL(request.url).searchParams;

  const {
    exhibitors: { exhibitors, totalCount },
    dividerTypes,
    standSizes,
  } = await promiseHash({
    exhibitors: db.show.exhibitor.findMany({
      pagination: {
        page: PageSearchParams.parse(searchParams).page,
        countPerPage: EXHIBITOR_COUNT_PER_PAGE,
      },
      searchParams: ExhibitorSearchParams.io.parse(searchParams),
      select: {
        createdAt: true,
        id: true,
        isOrganizersFavorite: true,
        isRisingStar: true,
        isVisible: true,
        logoPath: true,
        name: true,

        sponsorship: { select: { category: true } },
      },
    }),

    dividerTypes: db.show.dividerType.findMany({
      select: { id: true, label: true },
    }),

    standSizes: db.show.standSize.findMany({
      select: { id: true, label: true },
    }),
  });

  const pageCount = Math.ceil(totalCount / EXHIBITOR_COUNT_PER_PAGE);

  return json({ totalCount, pageCount, exhibitors, dividerTypes, standSizes });
}
