import { formatAge } from "@animeaux/core"
import { useLoaderData } from "@remix-run/react"
import { DateTime } from "luxon"

import { AnimalSmallItem } from "#i/animals/item.js"
import {
  AnimalSearchParams,
  AnimalSort,
  AnimalSortSearchParams,
  AnimalSterilization,
} from "#i/animals/search-params.js"
import { HAS_UP_COMMING_STERILISATION_CONDITIONS } from "#i/animals/situation/health.js"
import { Action } from "#i/core/actions.js"
import { BaseLink } from "#i/core/base-link.js"
import { SimpleEmpty } from "#i/core/data-display/empty.js"
import { Card } from "#i/core/layout/card.js"
import { Routes } from "#i/core/navigation.js"

import type { loader } from "./loader.server.js"

export function CardAnimalsToSterilize() {
  const { animal } = useLoaderData<typeof loader>()

  if (animal == null) {
    return null
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {animal.toSterilizeCount === 0
            ? "Stérilisations à prévoir"
            : animal.toSterilizeCount > 1
              ? `${animal.toSterilizeCount} stérilisations à prévoir`
              : "1 stérilisation à prévoir"}
        </Card.Title>

        {animal.toSterilizeCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.toString(),
                search: (() => {
                  const searchParams = AnimalSearchParams.create({
                    species: new Set(
                      HAS_UP_COMMING_STERILISATION_CONDITIONS.species,
                    ),
                    sterilizations: new Set([AnimalSterilization.NO]),
                    birthdateEnd: DateTime.now()
                      .minus({
                        months:
                          HAS_UP_COMMING_STERILISATION_CONDITIONS.ageInMonths,
                      })
                      .toJSDate(),
                    statuses: new Set(
                      HAS_UP_COMMING_STERILISATION_CONDITIONS.status,
                    ),
                  })

                  AnimalSortSearchParams.set(searchParams, {
                    sort: AnimalSort.BIRTHDATE,
                  })

                  return searchParams.toString()
                })(),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasListItems>
        {animal.toSterilizeCount === 0 ? (
          <SimpleEmpty
            isCompact
            icon="✂️"
            iconAlt="Ciseaux"
            title="Aucun animal à stériliser"
            message="À leur 6 mois, chiens et chats doivent être stérilisés."
            titleElementType="h3"
            className="h-full"
          />
        ) : (
          <ul className="grid grid-cols-1">
            {animal.toSterilize.map((animal) => (
              <li key={animal.id} className="flex flex-col">
                <AnimalSmallItem
                  animal={animal}
                  secondaryLabel={formatAge(animal.birthdate)}
                  imageLoading="eager"
                />
              </li>
            ))}
          </ul>
        )}
      </Card.Content>
    </Card>
  )
}
