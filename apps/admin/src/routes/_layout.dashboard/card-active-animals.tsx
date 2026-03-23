import { useLoaderData } from "@remix-run/react"

import { AnimalItem } from "#i/animals/item.js"
import { AnimalSearchParams } from "#i/animals/search-params.js"
import { ACTIVE_ANIMAL_STATUS } from "#i/animals/status.js"
import { Action } from "#i/core/actions.js"
import { BaseLink } from "#i/core/base-link.js"
import { SimpleEmpty } from "#i/core/data-display/empty.js"
import { Card } from "#i/core/layout/card.js"
import { Routes } from "#i/core/navigation.js"

import type { loader } from "./loader.server.js"

export function CardActiveAnimals() {
  const { animal } = useLoaderData<typeof loader>()

  if (animal == null) {
    return null
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {animal.activeCount === 0
            ? "Animaux en charge"
            : animal.activeCount > 1
              ? `${animal.activeCount} animaux en charge`
              : "1 animal en charge"}
        </Card.Title>

        {animal.activeCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.toString(),
                search: AnimalSearchParams.format({
                  statuses: new Set(ACTIVE_ANIMAL_STATUS),
                }),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasHorizontalScroll={animal.activeCount > 0}>
        {animal.activeCount === 0 ? (
          <SimpleEmpty
            isCompact
            icon="🦤"
            iconAlt="Dodo bird"
            title="Aucun animal en charge"
            titleElementType="h3"
            message="Pour l’instant ;)"
          />
        ) : (
          <ul className="flex">
            {animal.active.map((animal) => (
              <li
                key={animal.id}
                className="flex flex-none flex-col first:pl-1 last:pr-1 md:first:pl-1 md:last:pr-1"
              >
                <AnimalItem
                  animal={animal}
                  imageSizeMapping={{ default: "150px" }}
                  className="w-[160px] md:w-[170px]"
                />
              </li>
            ))}
          </ul>
        )}
      </Card.Content>
    </Card>
  )
}
