import { db } from "#core/db.server.js";
import { assertCurrentUserHasGroups } from "#current-user/groups.server.js";
import { ActivityField } from "#show/exhibitors/activity-field/activity-field.js";
import { ActivityTarget } from "#show/exhibitors/activity-target/activity-target.js";
import { ApplicationSearchParams } from "#show/exhibitors/applications/search-params.js";
import { SponsorshipCategory } from "#show/sponsors/category.js";
import { getCompleteLocation } from "@animeaux/core";
import type { Prisma } from "@animeaux/prisma";
import { UserGroup } from "@animeaux/prisma";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { csvFormatRows } from "d3-dsv";

const applicationSelect = {
  comments: true,
  motivation: true,
  proposalForOnStageEntertainment: true,
  sponsorshipCategory: true,
  structureActivityDescription: true,
  structureActivityFields: true,
  structureActivityTargets: true,
  structureAddress: true,
  structureCity: true,
  structureCountry: true,
  structureName: true,
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
    label: "Nom exposant",
    accessor: (application) => application.structureName,
  },
  {
    label: "Domaines d’activités",
    accessor: (application) =>
      application.structureActivityFields
        .map((field) => ActivityField.translation[field])
        .join(", "),
  },
  {
    label: "Cibles",
    accessor: (application) =>
      application.structureActivityTargets
        .map((target) => ActivityTarget.translation[target])
        .join(", "),
  },
  {
    label: "Présentation de l’activité",
    accessor: (application) => application.structureActivityDescription,
  },
  {
    label: "Lien",
    accessor: (application) => application.structureUrl,
  },
  {
    label: "Adresse",
    accessor: (application) =>
      getCompleteLocation({
        address: application.structureAddress,
        zipCode: application.structureZipCode,
        city: application.structureCity,
        country: application.structureCountry,
      }),
  },
  {
    label: "Sponsor",
    accessor: (application) =>
      application.sponsorshipCategory != null
        ? SponsorshipCategory.translation[application.sponsorshipCategory]
        : "",
  },
  {
    label: "Animations",
    accessor: (application) =>
      application.proposalForOnStageEntertainment ?? "",
  },
  {
    label: "Motivation",
    accessor: (application) => application.motivation,
  },
  {
    label: "Remarques",
    accessor: (application) => application.comments ?? "",
  },
];
