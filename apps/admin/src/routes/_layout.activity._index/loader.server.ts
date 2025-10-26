import { Activity } from "#activity/db.server.js";
import { ActivitySearchParams } from "#activity/search-params.js";
import { db } from "#core/db.server";
import { prisma } from "#core/prisma.server.js";
import { PageSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { UserGroup } from "@animeaux/prisma/server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new URL(request.url).searchParams;

  const {
    users,
    activitySearch: { activities, totalCount },
  } = await promiseHash({
    users: prisma.user.findMany({
      where: { activities: { some: {} } },
      select: { id: true, displayName: true },
      orderBy: { displayName: "asc" },
    }),

    activitySearch: Activity.findMany({
      searchParams: ActivitySearchParams.io.parse(searchParams),
      page: PageSearchParams.parse(searchParams).page,
      countPerPage: ACTIVITY_COUNT_PER_PAGE,
      select: {
        action: true,
        createdAt: true,
        id: true,
        resource: true,
        resourceId: true,
        actorType: true,
        actorId: true,
        user: { select: { id: true, displayName: true } },
        animal: { select: { name: true, alias: true, avatar: true } },
        fosterFamily: { select: { displayName: true, availability: true } },
      },
    }),
  });

  const pageCount = Math.ceil(totalCount / ACTIVITY_COUNT_PER_PAGE);

  return json({
    users,
    activities,
    totalCount,
    pageCount,
  });
}

const ACTIVITY_COUNT_PER_PAGE = 20;
