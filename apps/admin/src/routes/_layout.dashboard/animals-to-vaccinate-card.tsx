import { AnimalSmallItem } from "#animals/item";
import {
  AnimalSearchParams,
  AnimalSort,
  AnimalSortSearchParams,
} from "#animals/search-params";
import {
  HAS_UP_COMMING_VACCINATION_CONDITIONS,
  formatNextVaccinationDate,
  getNextVaccinationState,
} from "#animals/situation/health";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Empty } from "#core/data-display/empty";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./route";

export function AnimalsToVaccinateCard() {
  const { animalToVaccinateCount, animalsToVaccinate } =
    useLoaderData<loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {animalToVaccinateCount === 0
            ? "Vaccinations prévues"
            : animalToVaccinateCount > 1
              ? `${animalToVaccinateCount} vaccinations prévues`
              : "1 vaccination prévue"}
        </Card.Title>

        {animalToVaccinateCount > 0 ? (
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
        {animalToVaccinateCount === 0 ? (
          <Empty
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
            {animalsToVaccinate.map((animal) => (
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
