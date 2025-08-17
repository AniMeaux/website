import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { InvoiceStatus } from "#show/invoice/status.js";
import { safeParseRouteParam, zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import { CardDescription } from "./card-description";
import { CardDocuments } from "./card-documents";
import { CardDogsConfiguration } from "./card-dogs-configuration";
import { CardInvoices } from "./card-invoices";
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

  const { exhibitor, application, files, sponsor } = await promiseHash({
    exhibitor: db.show.exhibitor.findUnique(routeParams.id, {
      select: {
        id: true,
        isVisible: true,
        token: true,
        documentStatus: true,
        documentStatusMessage: true,
        folderId: true,
        dogsConfigurationStatus: true,
        dogsConfigurationStatusMessage: true,
        dogs: {
          select: {
            gender: true,
            id: true,
            idNumber: true,
            isCategorized: true,
            isSterilized: true,
          },
        },
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
        chairCount: true,
        dividerCount: true,
        dividerType: true,
        hasElectricalConnection: true,
        hasTablecloths: true,
        installationDay: true,
        invoices: {
          select: {
            amount: true,
            dueDate: true,
            id: true,
            number: true,
            status: true,
            url: true,
          },
        },
        locationNumber: true,
        peopleCount: true,
        placementComment: true,
        size: true,
        standNumber: true,
        standConfigurationStatus: true,
        standConfigurationStatusMessage: true,
        tableCount: true,
        zone: true,
      },
    }),

    application: db.show.exhibitor.application.findUniqueByExhibitor(
      routeParams.id,
      {
        select: {
          id: true,
          status: true,
          structureAddress: true,
          structureCity: true,
          structureCountry: true,
          structureLegalStatus: true,
          structureLegalStatusOther: true,
          structureSiret: true,
          structureZipCode: true,
        },
      },
    ),

    files: db.show.exhibitor.getFiles(routeParams.id),

    sponsor: db.show.sponsor.findUniqueByExhibitor(routeParams.id, {
      select: {
        id: true,
        category: true,
      },
    }),
  });

  return json({
    exhibitor: {
      ...exhibitor,
      ...files,

      invoiceStatus:
        exhibitor.invoices.length === 0
          ? null
          : exhibitor.invoices.some(
                (invoice) => invoice.status === InvoiceStatus.Enum.TO_PAY,
              )
            ? InvoiceStatus.Enum.TO_PAY
            : InvoiceStatus.Enum.PAID,
    },
    application,
    sponsor,
  });
}

const RouteParamsSchema = zu.object({
  id: zu.string().uuid(),
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: getPageTitle(data?.exhibitor.name ?? getErrorTitle(404)) }];
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
          <CardDogsConfiguration />
          <CardDocuments />
          <CardInvoices />
          <CardOnStandAnimations />
        </div>
      </PageLayout.Content>
    </>
  );
}

function Header() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Header.Root>
      <PageLayout.Header.Title>{exhibitor.name}</PageLayout.Header.Title>
    </PageLayout.Header.Root>
  );
}
