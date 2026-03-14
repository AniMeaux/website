import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";

import { AnimalSmallItem } from "#i/animals/item";
import {
  AnimalSearchParams,
  AnimalSort,
  AnimalSortSearchParams,
} from "#i/animals/search-params";
import {
  formatNextVaccinationDate,
  getNextVaccinationState,
  HAS_UP_COMMING_VACCINATION_CONDITIONS,
} from "#i/animals/situation/health";
import { Action } from "#i/core/actions";
import { BaseLink } from "#i/core/base-link";
import { SimpleEmpty } from "#i/core/data-display/empty";
import { Card } from "#i/core/layout/card";
import { Routes } from "#i/core/navigation";

import type { loader } from "./loader.server";

export function CardAnimalsToVaccinate() {
  const { animal } = useLoaderData<typeof loader>();

  if (animal == null) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {animal.toVaccinateCount === 0
            ? "Vaccinations prévues"
            : animal.toVaccinateCount > 1
              ? `${animal.toVaccinateCount} vaccinations prévues`
              : "1 vaccination prévue"}
        </Card.Title>

        {animal.toVaccinateCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.toString(),
                search: (() => {
                  const searchParams = AnimalSearchParams.create({
                    nextVaccinationDateEnd: DateTime.now()
                      .plus({
                        days: HAS_UP_COMMING_VACCINATION_CONDITIONS.nextVaccinationInDays,
                      })
                      .toJSDate(),
                    statuses: new Set(
                      HAS_UP_COMMING_VACCINATION_CONDITIONS.status,
                    ),
                  });

                  AnimalSortSearchParams.set(searchParams, {
                    sort: AnimalSort.VACCINATION,
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
        {animal.toVaccinateCount === 0 ? (
          <SimpleEmpty
            isCompact
            icon="💉"
            iconAlt="Seringue"
            title="Aucun animal à vacciner"
            message="Dans les 15 jours à venir."
            titleElementType="h3"
            className="h-full"
          />
        ) : (
          <ul className="grid grid-cols-1">
            {animal.toVaccinate.map((animal) => (
              <li key={animal.id} className="flex flex-col">
                <AnimalSmallItem
                  animal={animal}
                  hasError={
                    getNextVaccinationState(
                      animal.nextVaccinationDate,
                      animal.status,
                    ) === "past"
                  }
                  secondaryLabel={
                    <span className="first-letter:capitalize">
                      {formatNextVaccinationDate(animal.nextVaccinationDate)}
                    </span>
                  }
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
