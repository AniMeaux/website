import { SortAndFiltersFloatingAction } from "#core/controllers/sort-and-filters-floating-action";
import { db } from "#core/db.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import { PageSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { ApplicationFilters } from "#show/exhibitors/applications/filter-form";
import { ApplicationSearchParams } from "#show/exhibitors/applications/search-params";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import { CardList } from "./card-list";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const searchParams = new URL(request.url).searchParams;

  const {
    exhibitors: { applications, totalCount },
    standSizes,
  } = await promiseHash({
    exhibitors: db.show.exhibitor.application.findMany({
      page: PageSearchParams.parse(searchParams).page,
      countPerPage: APPLICATION_COUNT_PER_PAGE,
      searchParams: ApplicationSearchParams.parse(searchParams),
      select: {
        createdAt: true,
        id: true,
        status: true,
        structureActivityFields: true,
        structureActivityTargets: true,
        structureLegalStatus: true,
        structureLegalStatusOther: true,
        structureName: true,
      },
    }),

    standSizes: db.show.standSize.findMany({
      select: { id: true, label: true },
    }),
  });

  const pageCount = Math.ceil(totalCount / APPLICATION_COUNT_PER_PAGE);

  return json({
    totalCount,
    pageCount,
    applications,
    standSizes,
  });
}

const APPLICATION_COUNT_PER_PAGE = 20;

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Candidatures") }];
};

export default function Route() {
  const { totalCount, standSizes } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Content className="grid grid-cols-1">
      <section className="flex flex-col gap-1 md:flex-row md:gap-2">
        <section className="flex flex-col md:min-w-0 md:flex-2">
          <CardList />
        </section>

        <aside className="hidden min-w-[250px] max-w-[300px] flex-1 flex-col md:flex">
          <Card className="sticky top-[calc(20px+var(--header-height))] max-h-[calc(100vh-40px-var(--header-height))]">
            <Card.Header>
              <Card.Title>Filtrer</Card.Title>
            </Card.Header>

            <Card.Content hasVerticalScroll>
              <ApplicationFilters standSizes={standSizes} />
            </Card.Content>
          </Card>
        </aside>
      </section>

      <SortAndFiltersFloatingAction totalCount={totalCount}>
        <ApplicationFilters standSizes={standSizes} />
      </SortAndFiltersFloatingAction>
    </PageLayout.Content>
  );
}
