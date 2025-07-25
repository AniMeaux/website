import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { RouteParamsSchema } from "./route";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const application = await db.show.exhibitor.application.findUnique(
    routeParams.applicationId,
    {
      select: {
        comments: true,
        contactEmail: true,
        contactFirstname: true,
        contactLastname: true,
        contactPhone: true,
        createdAt: true,
        desiredStandSize: true,
        discoverySource: true,
        id: true,
        motivation: true,
        otherPartnershipCategory: true,
        partnershipCategory: true,
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
        structureLogoPath: true,
        structureName: true,
        structureOtherLegalStatus: true,
        structureSiret: true,
        structureUrl: true,
        structureZipCode: true,

        exhibitor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  );

  return json({ application });
}
