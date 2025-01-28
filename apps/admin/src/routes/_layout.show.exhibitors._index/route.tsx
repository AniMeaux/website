import { SortAndFiltersFloatingAction } from "#core/controllers/sort-and-filters-floating-action";
import { db } from "#core/db.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server";
import { PageSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { ExhibitorFilters } from "#show/exhibitors/filter-form";
import { ExhibitorSearchParams } from "#show/exhibitors/search-params";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
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

  const { exhibitors, totalCount } = await db.show.exhibitor.findMany({
    page: PageSearchParams.parse(searchParams).page,
    countPerPage: EXHIBITOR_COUNT_PER_PAGE,
    searchParams: ExhibitorSearchParams.parse(searchParams),
    select: {
      createdAt: true,
      id: true,
      isVisible: true,

      application: {
        select: { status: true },
      },

      profile: {
        select: {
          logoPath: true,
          name: true,
        },
      },
    },
  });

  const pageCount = Math.ceil(totalCount / EXHIBITOR_COUNT_PER_PAGE);

  return json({
    totalCount,
    pageCount,
    exhibitors: exhibitors.map(({ application, profile, ...exhibitor }) => {
      if (profile == null || application == null) {
        throw notFound();
      }

      return { ...exhibitor, application, profile };
    }),
  });
}

const EXHIBITOR_COUNT_PER_PAGE = 20;

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Candidatures") }];
};

export default function Route() {
  const { totalCount } = useLoaderData<typeof loader>();

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
              <ExhibitorFilters />
            </Card.Content>
          </Card>
        </aside>
      </section>

      <SortAndFiltersFloatingAction totalCount={totalCount}>
        <ExhibitorFilters />
      </SortAndFiltersFloatingAction>
    </PageLayout.Content>
  );
}
