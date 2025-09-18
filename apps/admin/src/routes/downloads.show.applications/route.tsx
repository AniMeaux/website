import { createConfig } from "#core/config.server.js";
import { createCloudinaryUrl } from "#core/data-display/image.js";
import { db } from "#core/db.server.js";
import { assertCurrentUserHasGroups } from "#current-user/groups.server.js";
import { ActivityField } from "#show/exhibitors/activity-field/activity-field.js";
import { ActivityTarget } from "#show/exhibitors/activity-target/activity-target.js";
import { DiscoverySource } from "#show/exhibitors/applications/discovery-source.js";
import { LegalStatus } from "#show/exhibitors/applications/legal-status.js";
import { ApplicationSearchParams } from "#show/exhibitors/applications/search-params.js";
import { TRANSLATION_BY_APPLICATION_STATUS } from "#show/exhibitors/applications/status.js";
import { SponsorshipCategory } from "#show/sponsors/category.js";
import { getCompleteLocation } from "@animeaux/core";
import type { Prisma } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { csvFormatRows } from "d3-dsv";
import { DateTime } from "luxon";

const applicationSelect = {
  comments: true,
  contactEmail: true,
  contactFirstname: true,
  contactLastname: true,
  contactPhone: true,
  createdAt: true,
  desiredStandSize: { select: { label: true } },
  discoverySource: true,
  discoverySourceOther: true,
  id: true,
  motivation: true,
  proposalForOnStageEntertainment: true,
  refusalMessage: true,
  sponsorshipCategory: true,
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
} satisfies Prisma.ShowExhibitorApplicationSelect;

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new URL(request.url).searchParams;

  const { applications } = await db.show.exhibitor.application.findMany({
    searchParams: ApplicationSearchParams.parse(searchParams),
    select: applicationSelect,
  });

  return new Response(
    csvFormatRows([
      columns.map((column) => column.label),

      ...applications.map((application) =>
        columns.map((column) => column.accessor(application)),
      ),
    ]),
  );
}

type ColumnDefinition = {
  label: string;
  accessor: (
    application: Prisma.ShowExhibitorApplicationGetPayload<{
      select: typeof applicationSelect;
    }>,
  ) => string;
};

const columns: ColumnDefinition[] = [
  {
    label: "Date de candidature",
    accessor: (application) =>
      DateTime.fromJSDate(application.createdAt).toLocaleString(
        DateTime.DATETIME_SHORT,
      ),
  },
  {
    label: "Statut",
    accessor: (application) =>
      TRANSLATION_BY_APPLICATION_STATUS[application.status],
  },
  {
    label: "Message de refus",
    accessor: (application) => application.refusalMessage ?? "",
  },
  {
    label: "Nom",
    accessor: (application) => application.contactLastname,
  },
  {
    label: "Prénom",
    accessor: (application) => application.contactFirstname,
  },
  {
    label: "Adresse e-mail",
    accessor: (application) => application.contactEmail,
  },
  {
    label: "Numéro de téléphone",
    accessor: (application) => application.contactPhone,
  },
  {
    label: "Logo",
    accessor: (application) => {
      const config = createConfig();

      return createCloudinaryUrl(
        config.cloudinaryName,
        application.structureLogoPath,
        { aspectRatio: "4:3", format: "jpg" },
      );
    },
  },
  {
    label: "Nom",
    accessor: (application) => application.structureName,
  },
  {
    label: "Forme juridique",
    accessor: (application) =>
      LegalStatus.getVisibleValue({
        legalStatus: application.structureLegalStatus,
        legalStatusOther: application.structureLegalStatusOther,
      }),
  },
  {
    label: "SIRET/Identification",
    accessor: (application) => application.structureSiret,
  },
  {
    label: "Adresse de domiciliation",
    accessor: (application) =>
      getCompleteLocation({
        address: application.structureAddress,
        zipCode: application.structureZipCode,
        city: application.structureCity,
        country: application.structureCountry,
      }),
  },
  {
    label: "Lien",
    accessor: (application) => application.structureUrl,
  },
  {
    label: "Présentation de l’activité",
    accessor: (application) => application.structureActivityDescription,
  },
  {
    label: "Cibles",
    accessor: (application) =>
      application.structureActivityTargets
        .map((target) => ActivityTarget.translation[target])
        .join(", "),
  },
  {
    label: "Domaines d’activités",
    accessor: (application) =>
      application.structureActivityFields
        .map((field) => ActivityField.translation[field])
        .join(", "),
  },
  {
    label: "Taille du stand souhaité",
    accessor: (application) => application.desiredStandSize.label,
  },
  {
    label: "Sponsor",
    accessor: (application) =>
      application.sponsorshipCategory != null
        ? SponsorshipCategory.translation[application.sponsorshipCategory]
        : "",
  },
  {
    label: "Source",
    accessor: (application) => DiscoverySource.getVisibleValue(application),
  },
  {
    label: "Motivation",
    accessor: (application) => application.motivation,
  },
  {
    label: "Animation sur scène",
    accessor: (application) =>
      application.proposalForOnStageEntertainment ?? "",
  },
  {
    label: "Remarques",
    accessor: (application) => application.comments ?? "",
  },
  {
    label: "ID",
    accessor: (application) => application.id,
  },
];
