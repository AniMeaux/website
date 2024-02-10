import { AnimalSmallItem } from "#animals/item";
import {
  AnimalSearchParams,
  AnimalSort,
  AnimalSterilization,
} from "#animals/search-params";
import { HAS_UP_COMMING_STERILISATION_CONDITIONS } from "#animals/situation/health";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Empty } from "#core/data-display/empty";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { formatAge } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./route";

export function AnimalsToSterilizeCard() {
  const { animalToSterilizeCount, animalsToSterilize } =
    useLoaderData<loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {animalToSterilizeCount === 0
            ? "Stérilisations à prévoir"
            : animalToSterilizeCount > 1
              ? `${animalToSterilizeCount} stérilisations à prévoir`
              : "1 stérilisation à prévoir"}
        </Card.Title>

        {animalToSterilizeCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.toString(),
                search: AnimalSearchParams.stringify({
                  sort: AnimalSort.BIRTHDATE,
                  species: new Set(
                    HAS_UP_COMMING_STERILISATION_CONDITIONS.species,
                  ),
                  sterilizations: new Set([AnimalSterilization.NO]),
                  birthdateEnd: DateTime.now()
                    .minus({
                      months:
                        HAS_UP_COMMING_STERILISATION_CONDITIONS.ageInMonths,
                    })
                    .toISODate(),
                  statuses: new Set(
                    HAS_UP_COMMING_STERILISATION_CONDITIONS.status,
                  ),
                }),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasListItems>
        {animalToSterilizeCount === 0 ? (
          <Empty
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
            {animalsToSterilize.map((animal) => (
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
