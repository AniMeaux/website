import { db } from "#core/db.server.js";
import { assertCurrentUserHasGroups } from "#current-user/groups.server.js";
import { ExhibitorSearchParams } from "#show/exhibitors/search-params.js";
import type { Prisma } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { csvFormatRows } from "d3-dsv";

const exhibitorSelect = {
  // id: true,
  // createdAt: true,
  // updatedAt: true,
  // token: true,
  // isOrganizer: true,
  // isVisible: true,
  // billingAddress: true,
  // billingCity: true,
  // billingZipCode: true,
  // billingCountry: true,
  name: true,
  // category: true,
  // publicProfileStatus: true,
  // publicProfileStatusMessage: true,
  // activityFields: true,
  // activityTargets: true,
  // links: true,
  // logoPath: true,
  // descriptionStatus: true,
  // descriptionStatusMessage: true,
  // description: true,
  // onStandAnimationsStatus: true,
  // onStandAnimationsStatusMessage: true,
  // onStandAnimations: true,
  // documentStatus: true,
  // documentStatusMessage: true,
  // folderId: true,
  // identificationFileId: true,
  // insuranceFileId: true,
  // kbisFileId: true,
  // dogsConfigurationStatus: true,
  // dogsConfigurationStatusMessage: true,
  // standConfigurationStatus: true,
  // standConfigurationStatusMessage: true,
  // chairCount: true,
  // dividerCount: true,
  // hasCorner: true,
  // hasElectricalConnection: true,
  // hasTableCloths: true,
  // installationDay: true,
  // locationNumber: true,
  // peopleCount: true,
  // placementComment: true,
  // standNumber: true,
  // tableCount: true,
  // perksStatus: true,
  // perksStatusMessage: true,
  // appetizerPeopleCount: true,
  // breakfastPeopleCountSaturday: true,
  // breakfastPeopleCountSunday: true,
  // application: { select: { id: true } },
  // sponsorship: { select: { category: true } },
  // animations: { select: { id: true } },
  // invoices: { select: { id: true } },
  // dogs: { select: { id: true } },
  // size: { select: { label: true } },
  // dividerType: { select: { label: true } },
} satisfies Prisma.ShowExhibitorSelect;

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new URL(request.url).searchParams;

  const { exhibitors } = await db.show.exhibitor.findMany({
    searchParams: ExhibitorSearchParams.parse(searchParams),
    select: exhibitorSelect,
  });

  return new Response(
    csvFormatRows([
      columns.map((column) => column.label),

      ...exhibitors.map((exhibitors) =>
        columns.map((column) => column.accessor(exhibitors)),
      ),
    ]),
  );
}

type ColumnDefinition = {
  label: string;
  accessor: (
    exhibitors: Prisma.ShowExhibitorGetPayload<{
      select: typeof exhibitorSelect;
    }>,
  ) => string;
};

const columns: ColumnDefinition[] = [
  {
    label: "Nom exposant",
    accessor: (exhibitor) => exhibitor.name,
  },
];
