import { useOptimisticSearchParams } from "@animeaux/search-params-io"
import { useLoaderData } from "@remix-run/react"

import { Action } from "#i/core/actions.js"
import { BaseLink } from "#i/core/base-link.js"
import { Paginator } from "#i/core/controllers/paginator.js"
import { SimpleEmpty } from "#i/core/data-display/empty.js"
import { Card } from "#i/core/layout/card.js"
import { SponsorSearchParams } from "#i/show/sponsors/search-params.js"

import { SponsorItem } from "./item.js"
import type { loader } from "./route.js"

export function CardList() {
  const { totalCount, pageCount, sponsors } = useLoaderData<typeof loader>()
  const [searchParams] = useOptimisticSearchParams()

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {totalCount} {totalCount > 1 ? "sponsors" : "sponsor"}
        </Card.Title>
      </Card.Header>

      <Card.Content hasListItems>
        {sponsors.length > 0 ? (
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-1 md:gap-x-2 @lg/card-content:grid-cols-[auto_auto_1fr_auto]">
            {sponsors.map((sponsor) => (
              <SponsorItem key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        ) : (
          <SimpleEmpty
            isCompact
            icon="🏅"
            iconAlt="Médaille"
            title="Aucun sponsor trouvé"
            message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
            titleElementType="h3"
            action={
              !SponsorSearchParams.isEmpty(searchParams) ? (
                <Action asChild>
                  <BaseLink to={{ search: "" }}>Effacer les filtres</BaseLink>
                </Action>
              ) : null
            }
          />
        )}
      </Card.Content>

      {pageCount > 1 ? (
        <Card.Footer>
          <Paginator pageCount={pageCount} />
        </Card.Footer>
      ) : null}
    </Card>
  )
}
