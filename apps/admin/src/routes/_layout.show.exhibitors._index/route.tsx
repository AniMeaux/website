import { SortAndFiltersFloatingAction } from "#core/controllers/sort-and-filters-floating-action";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import { ExhibitorFilters } from "#show/exhibitors/filter-form";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { CardList } from "./card-list";
import type { loader } from "./loader.server.js";

export { loader } from "./loader.server.js";

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Candidatures") }];
};

export default function Route() {
  const { totalCount, dividerTypes, standSizes } =
    useLoaderData<typeof loader>();

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
              <ExhibitorFilters
                dividerTypes={dividerTypes}
                standSizes={standSizes}
              />
            </Card.Content>
          </Card>
        </aside>
      </section>

      <SortAndFiltersFloatingAction totalCount={totalCount}>
        <ExhibitorFilters dividerTypes={dividerTypes} standSizes={standSizes} />
      </SortAndFiltersFloatingAction>
    </PageLayout.Content>
  );
}
