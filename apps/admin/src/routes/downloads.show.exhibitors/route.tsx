import type { Prisma } from "@animeaux/prisma";
import { UserGroup } from "@animeaux/prisma";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { csvFormatRows } from "d3-dsv";

import { db } from "#i/core/db.server.js";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server.js";
import { ExhibitorSearchParams } from "#i/show/exhibitors/search-params.js";

const exhibitorSelect = {
  appetizerPeopleCount: true,
  breakfastPeopleCountSaturday: true,
  breakfastPeopleCountSunday: true,
  chairCount: true,
  dividerCount: true,
  dividerType: { select: { label: true } },
  dogs: { select: { id: true } },
  hasTableCloths: true,
  name: true,
  tableCount: true,
} satisfies Prisma.ShowExhibitorSelect;

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new URL(request.url).searchParams;

  const { exhibitors } = await db.show.exhibitor.findMany({
    searchParams: ExhibitorSearchParams.io.parse(searchParams),
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
    label: "Nom",
    accessor: (exhibitor) => exhibitor.name,
  },
  {
    label: "Type de cloisons",
    accessor: (exhibitor) => exhibitor.dividerType?.label ?? "",
  },
  {
    label: "Nombre de cloisons",
    accessor: (exhibitor) => String(exhibitor.dividerCount),
  },
  {
    label: "Nombre de tables",
    accessor: (exhibitor) => String(exhibitor.tableCount),
  },
  {
    label: "Nappage",
    accessor: (exhibitor) => (exhibitor.hasTableCloths ? "Oui" : "Non"),
  },
  {
    label: "Nombre de chaises",
    accessor: (exhibitor) => String(exhibitor.chairCount),
  },
  {
    label: "Chiens sur stand",
    accessor: (exhibitor) => (exhibitor.dogs.length > 0 ? "Oui" : "Non"),
  },
  {
    label: "Nombre de pdj samedi",
    accessor: (exhibitor) => String(exhibitor.breakfastPeopleCountSaturday),
  },
  {
    label: "Nombre de pdj dimanche",
    accessor: (exhibitor) => String(exhibitor.breakfastPeopleCountSunday),
  },
  {
    label: "Nombre d’apéro",
    accessor: (exhibitor) => String(exhibitor.appetizerPeopleCount),
  },
];
