import { db } from "#i/core/db.server";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server";
import { SponsorshipOptionalCategory } from "#i/show/sponsors/category";
import { hasGroups } from "#i/users/groups.js";
import { UserGroup } from "@animeaux/prisma/server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { RouteParamsSchema } from "./route-params";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const canDelete = hasGroups(currentUser, [UserGroup.ADMIN]);

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const application = await db.show.exhibitor.application.findUnique(
    routeParams.id,
    {
      select: {
        comments: true,
        contactEmail: true,
        contactFirstname: true,
        contactLastname: true,
        contactPhone: true,
        createdAt: true,
        desiredStandSize: { select: { id: true, label: true } },
        discoverySource: true,
        discoverySourceOther: true,
        id: true,
        motivation: true,
        sponsorshipCategory: true,
        proposalForOnStageEntertainment: true,
        refusalMessage: true,
        status: true,
        structureActivityDescription: true,
        structureActivityFields: true,
        structureActivityTargets: true,
        structureAddress: true,
        structureCity: true,
        structureCountry: true,
        structureLegalStatus: true,
        structureLegalStatusOther: true,
        structureLogoPath: true,
        structureName: true,
        structureSiret: true,
        structureUrl: true,
        structureZipCode: true,

        exhibitor: {
          select: {
            id: true,
            name: true,

            animations: { select: { id: true } },

            sponsorship: {
              select: { category: true },
            },
          },
        },
      },
    },
  );

  return json({
    canDelete,

    application: {
      ...application,

      sponsorshipCategory: SponsorshipOptionalCategory.fromDb(
        application.sponsorshipCategory,
      ),
    },
  });
}
