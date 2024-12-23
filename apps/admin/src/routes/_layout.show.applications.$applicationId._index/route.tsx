import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { assertIsDefined } from "#core/is-defined.server";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import { NotFoundResponse } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
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

  const routeParams = RouteParamsSchema.safeParse(params);
  if (!routeParams.success) {
    throw new NotFoundResponse();
  }

  const application = await prisma.showExhibitorApplication.findUnique({
    where: { id: routeParams.data.applicationId },
    select: {
      id: true,
      status: true,
      refusalMessage: true,
      contactEmail: true,
      contactFirstname: true,
      contactLastname: true,
      contactPhone: true,
      structureActivityTargets: true,
      structureActivityFields: true,
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
      billingAddress: true,
      billingCity: true,
      billingCountry: true,
      billingZipCode: true,
      desiredStandSize: true,
      proposalForOnStageEntertainment: true,
      partnershipCategory: true,
      otherPartnershipCategory: true,
      discoverySource: true,

      exhibitor: {
        select: {
          id: true,
          profile: { select: { name: true } },
        },
      },
    },
  });

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
      <div className="grid grid-cols-1 gap-1 md:gap-2">
        <CardStructure />
        <CardParticipation />

        <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
          <CardPartnership />
          <CardDiscoverySource />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1 md:gap-2">
        <CardSituation />
        <CardSituationRefusalMessage />
        <CardContact />
      </div>
    </PageLayout.Content>
  );
}
