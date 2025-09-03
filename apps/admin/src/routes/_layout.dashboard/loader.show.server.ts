import { db } from "#core/db.server";
import { ApplicationSearchParamsN } from "#show/exhibitors/applications/search-params.js";
import { ShowExhibitorApplicationStatus } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";

export async function loaderShow() {
  return await promiseHash({
    untreatedApplications: db.show.exhibitor.application.findMany({
      searchParams: {
        fields: new Set(),
        sort: ApplicationSearchParamsN.DEFAULT_SORT,
        sponsorshipCategories: new Set(),
        targets: new Set(),
        statuses: new Set([ShowExhibitorApplicationStatus.UNTREATED]),
      },
      countPerPage: 3,
      page: 0,
      select: {
        id: true,
        structureName: true,
        createdAt: true,
        structureLogoPath: true,
        structureActivityFields: true,
      },
    }),

    standSizeBooking: db.show.standSize.findManyWithAvailability({
      select: { id: true, label: true, maxCount: true },
    }),
  });
}
