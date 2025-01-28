import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { assertIsDefined } from "#core/is-defined.server";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { safeParseRouteParam, zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { CardComments } from "./card-comments";
import { CardContact } from "./card-contact";
import { CardDiscoverySource } from "./card-discovery-source";
import { CardParticipation } from "./card-participation";
import { CardPartnership } from "./card-partnership";
import { CardSituation } from "./card-situation";
import { CardSituationRefusalMessage } from "./card-situation-refusal-message";
import { CardStructure } from "./card-structure";

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
        billingAddress: true,
        billingCity: true,
        billingCountry: true,
        billingZipCode: true,
        comments: true,
        contactEmail: true,
        contactFirstname: true,
        contactLastname: true,
        contactPhone: true,
        createdAt: true,
        desiredStandSize: true,
        discoverySource: true,
        id: true,
        otherPartnershipCategory: true,
        partnershipCategory: true,
        proposalForOnStageEntertainment: true,
        refusalMessage: true,
        status: true,
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
            profile: { select: { name: true } },
          },
        },
      },
    },
  );

  assertIsDefined(application);

  return json({ application });
}

const RouteParamsSchema = zu.object({
  applicationId: zu.string().uuid(),
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: getPageTitle(
        data?.application.structureName != null
          ? `Candidature de ${data.application.structureName}`
          : getErrorTitle(404),
      ),
    },
  ];
};

export function ErrorBoundary() {
  return (
    <PageLayout.Content className="grid grid-cols-1">
      <ErrorPage />
    </PageLayout.Content>
  );
}

export default function Route() {
  return (
    <PageLayout.Content className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
      <div className="grid grid-cols-1 gap-1 md:col-start-2 md:row-start-1 md:gap-2">
        <CardSituation />
        <CardSituationRefusalMessage />
        <CardContact />
      </div>

      <div className="grid grid-cols-1 gap-1 md:gap-2">
        <CardStructure />
        <CardParticipation />
        <CardComments />

        <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
          <CardPartnership />
          <CardDiscoverySource />
        </div>
      </div>
    </PageLayout.Content>
  );
}
