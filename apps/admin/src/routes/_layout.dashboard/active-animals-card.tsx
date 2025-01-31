import { AnimalItem } from "#animals/item";
import { AnimalSearchParams } from "#animals/search-params";
import { ACTIVE_ANIMAL_STATUS } from "#animals/status";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { SimpleEmpty } from "#core/data-display/empty";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function ActiveAnimalsCard() {
  const { activeAnimalCount, activeAnimals } = useLoaderData<loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {activeAnimalCount === 0
            ? "Animaux en charge"
            : activeAnimalCount > 1
              ? `${activeAnimalCount} animaux en charge`
              : "1 animal en charge"}
        </Card.Title>

        {activeAnimalCount > 0 ? (
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

      <Card.Content hasHorizontalScroll={activeAnimalCount > 0}>
        {activeAnimalCount === 0 ? (
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
            {activeAnimals.map((animal) => (
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
  );
}
