import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { safeParseRouteParam, zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import { CardDescription } from "./card-description";
import { CardDocuments } from "./card-documents";
import { CardOnStandAnimations } from "./card-on-stand-animations";
import { CardProfile } from "./card-profile";
import { CardSituation } from "./card-situation";
import { CardStandConfiguration } from "./card-stand-configuration";
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

  const {
    exhibitor,
    application,
    documents,
    files,
    profile,
    standConfiguration,
  } = await promiseHash({
    exhibitor: db.show.exhibitor.findUnique(routeParams.id, {
      select: {
        id: true,
        isVisible: true,
        token: true,
        hasPaid: true,
      },
    }),

    application: db.show.exhibitor.application.findUniqueByExhibitor(
      routeParams.id,
      {
        select: {
          billingAddress: true,
          billingCity: true,
          billingCountry: true,
          billingZipCode: true,
          id: true,
          status: true,
          structureAddress: true,
          structureCity: true,
          structureCountry: true,
          structureLegalStatus: true,
          structureOtherLegalStatus: true,
          structureSiret: true,
          structureZipCode: true,
        },
      },
    ),

    documents: db.show.exhibitor.documents.findUniqueByExhibitor(
      routeParams.id,
      {
        select: {
          status: true,
          statusMessage: true,
          folderId: true,
        },
      },
    ),

    files: db.show.exhibitor.documents.getFilesByExhibitor(routeParams.id),

    profile: db.show.exhibitor.profile.findUniqueByExhibitor(routeParams.id, {
      select: {
        activityFields: true,
        activityTargets: true,
        description: true,
        descriptionStatus: true,
        descriptionStatusMessage: true,
        links: true,
        logoPath: true,
        name: true,
        onStandAnimations: true,
        onStandAnimationsStatus: true,
        onStandAnimationsStatusMessage: true,
        publicProfileStatus: true,
        publicProfileStatusMessage: true,
      },
    }),

    standConfiguration:
      db.show.exhibitor.standConfiguration.findUniqueByExhibitor(
        routeParams.id,
        {
          select: {
            chairCount: true,
            dividerCount: true,
            dividerType: true,
            hasElectricalConnection: true,
            hasTablecloths: true,
            installationDay: true,
            locationNumber: true,
            peopleCount: true,
            placementComment: true,
            size: true,
            standNumber: true,
            status: true,
            statusMessage: true,
            tableCount: true,
            zone: true,
          },
        },
      ),
  });

  return json({
    exhibitor,
    application,
    documents: { ...documents, ...files },
    profile,
    standConfiguration,
  });
}

const RouteParamsSchema = zu.object({
  id: zu.string().uuid(),
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: getPageTitle(
        data?.profile.name != null ? data.profile.name : getErrorTitle(404),
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
    <>
      <Header />

      <PageLayout.Content className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
        <div className="grid grid-cols-1 gap-1 md:col-start-2 md:row-start-1 md:gap-2">
          <CardSituation />
          <CardProfile />
          <CardStructure />
        </div>

        <div className="grid grid-cols-1 gap-1 md:gap-2">
          <CardDescription />
          <CardStandConfiguration />
          <CardDocuments />
          <CardOnStandAnimations />

          <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2"></div>
        </div>
      </PageLayout.Content>
    </>
  );
}

export function Header() {
  const { profile } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Header.Root>
      <PageLayout.Header.Title>{profile.name}</PageLayout.Header.Title>
    </PageLayout.Header.Root>
  );
}
