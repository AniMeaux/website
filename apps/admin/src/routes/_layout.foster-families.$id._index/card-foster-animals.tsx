import { AnimalItem } from "#animals/item";
import { AnimalSearchParams } from "#animals/search-params";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { SimpleEmpty } from "#core/data-display/empty";
import { InlineHelper } from "#core/data-display/helper";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { FosterFamilyAvailability } from "#foster-families/availability";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./loader.server";

export function CardFosterAnimals() {
  const { fosterFamily, fosterAnimalCount, fosterAnimals } =
    useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {fosterAnimalCount === 0
            ? "Animaux accueillis"
            : fosterAnimalCount > 1
              ? `${fosterAnimalCount} animaux accueillis`
              : "1 animal accueillis"}
        </Card.Title>

        {fosterAnimalCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.toString(),
                search: AnimalSearchParams.format({
                  fosterFamiliesId: new Set([fosterFamily.id]),
                }),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasHorizontalScroll={fosterAnimalCount > 0}>
        {fosterAnimalCount === 0 ? (
          <SimpleEmpty
            isCompact
            icon="🏡"
            iconAlt="Maison avec jardin"
            title="Aucun animal accueilli"
            titleElementType="h3"
            message="Pour l’instant ;)"
          />
        ) : (
          <>
            {fosterFamily.availability ===
              FosterFamilyAvailability.Enum.AVAILABLE &&
            fosterFamily.availabilityExpirationDate != null ? (
              <span className="grid grid-cols-1 px-1.5 md:px-2">
                <InlineHelper variant="warning" icon="icon-clock-solid">
                  {fosterFamily.displayName} ne sera plus disponible à partir du{" "}
                  {DateTime.fromISO(fosterFamily.availabilityExpirationDate)
                    .plus({ days: 1 })
                    .toLocaleString(DateTime.DATE_FULL)}
                  .
                </InlineHelper>
              </span>
            ) : null}

            <ul className="flex">
              {fosterAnimals.map((animal) => (
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
          </>
        )}
      </Card.Content>
    </Card>
  );
}
