import type { MetaFunction } from "@remix-run/react"
import { useLoaderData } from "@remix-run/react"

import { SortAndFiltersFloatingAction } from "#i/core/controllers/sort-and-filters-floating-action.js"
import { Card } from "#i/core/layout/card.js"
import { PageLayout } from "#i/core/layout/page.js"
import { getPageTitle } from "#i/core/page-title.js"
import { ExhibitorFilters } from "#i/show/exhibitors/filter-form.js"

import { CardList } from "./card-list.js"
import type { loader } from "./loader.server.js"

export { loader } from "./loader.server.js"

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Candidatures") }]
}

export default function Route() {
  const { totalCount, dividerTypes, standSizes } =
    useLoaderData<typeof loader>()

  return (
    <PageLayout.Content className="grid grid-cols-1">
      <section className="flex flex-col gap-1 md:flex-row md:gap-2">
        <section className="flex flex-col md:min-w-0 md:flex-2 md:shrink-2">
          <CardList />
        </section>

        <aside className="hidden max-w-30 min-w-25 flex-1 flex-col md:flex">
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
  )
}
