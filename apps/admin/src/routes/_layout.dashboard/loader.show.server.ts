import { db } from "#i/core/db.server";
import {
  ApplicationSearchParams,
  ApplicationSearchParamsN,
} from "#i/show/exhibitors/applications/search-params.js";
import { ShowExhibitorApplicationStatus } from "@animeaux/prisma/server";
import { promiseHash } from "remix-utils/promise";

export async function loaderShow() {
  return await promiseHash({
    untreatedApplications: db.show.exhibitor.application.findMany({
      searchParams: ApplicationSearchParams.parse(
        ApplicationSearchParams.create({
          sort: ApplicationSearchParamsN.Sort.CREATED_AT,
          statuses: new Set([ShowExhibitorApplicationStatus.UNTREATED]),
        }),
      ),
      pagination: { countPerPage: 6, page: 0 },
      select: {
        id: true,
        structureName: true,
        createdAt: true,
        structureLogoPath: true,
        structureActivityFields: true,
      },
    }),

    standSizes: db.show.standSize.findManyWithAvailability({
      select: { id: true, label: true },
    }),
  });
}
