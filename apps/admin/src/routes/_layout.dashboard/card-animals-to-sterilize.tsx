import { AnimalSmallItem } from "#animals/item";
import {
  AnimalSearchParams,
  AnimalSort,
  AnimalSortSearchParams,
  AnimalSterilization,
} from "#animals/search-params";
import { HAS_UP_COMMING_STERILISATION_CONDITIONS } from "#animals/situation/health";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { SimpleEmpty } from "#core/data-display/empty";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { formatAge } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./loader.server";

export function CardAnimalsToSterilize() {
  const { animal } = useLoaderData<typeof loader>();

  if (animal == null) {
    return null;
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
                  });

                  AnimalSortSearchParams.set(searchParams, {
                    sort: AnimalSort.BIRTHDATE,
                  });

                  return searchParams.toString();
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
  );
}
