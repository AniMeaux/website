import { useLoaderData } from "@remix-run/react"

import { Action } from "#i/core/actions.js"
import { BaseLink } from "#i/core/base-link.js"
import { SimpleEmpty } from "#i/core/data-display/empty.js"
import { Card } from "#i/core/layout/card.js"
import { Routes } from "#i/core/navigation.js"

import { StandSizeItem } from "./item.js"
import type { loader } from "./loader.server.js"

export function CardList() {
  const { standSizes } = useLoaderData<typeof loader>()

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {standSizes.length}{" "}
          {standSizes.length > 1 ? "tailles de stand" : "taille de stand"}
        </Card.Title>

        <Action asChild variant="text">
          <BaseLink to={Routes.show.standSizes.new.toString()}>Créer</BaseLink>
        </Action>
      </Card.Header>

      <Card.Content hasListItems>
        {standSizes.length > 0 ? (
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-1 md:gap-x-2">
            {standSizes.map((standSize) => (
              <StandSizeItem key={standSize.id} standSize={standSize} />
            ))}
          </div>
        ) : (
          <SimpleEmpty
            isCompact
            icon="📐"
            iconAlt="Équerre"
            title="Aucune taille de stand trouvée"
            message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
            titleElementType="h3"
          />
        )}
      </Card.Content>
    </Card>
  )
}
