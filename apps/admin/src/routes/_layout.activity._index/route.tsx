import { ActivityFilters } from "#i/activity/filter-form.js";
import { SortAndFiltersFloatingAction } from "#i/core/controllers/sort-and-filters-floating-action";
import { Card } from "#i/core/layout/card";
import { PageLayout } from "#i/core/layout/page";
import { getPageTitle } from "#i/core/page-title";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CardList } from "./card-list";
import type { loader } from "./loader.server";

export { loader } from "./loader.server";

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Activité") }];
};

export default function Route() {
  const { users, totalCount } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
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
                <ActivityFilters users={users} />
              </Card.Content>
            </Card>
          </aside>
        </section>

        <SortAndFiltersFloatingAction totalCount={totalCount}>
          <ActivityFilters users={users} />
        </SortAndFiltersFloatingAction>
      </PageLayout.Content>
    </PageLayout.Root>
  );
}
