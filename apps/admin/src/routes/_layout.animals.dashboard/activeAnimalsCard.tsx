import { AnimalItem } from "#animals/item.tsx";
import { AnimalSearchParams } from "#animals/searchParams.ts";
import { ACTIVE_ANIMAL_STATUS } from "#animals/status.tsx";
import { Action } from "#core/actions.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { Empty } from "#core/dataDisplay/empty.tsx";
import { Card } from "#core/layout/card.tsx";
import { Routes } from "#core/navigation.ts";
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
                pathname: Routes.animals.search.toString(),
                search: AnimalSearchParams.stringify({
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
          <Empty
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
                className="flex flex-none flex-col first:pl-0.5 last:pr-0.5 md:first:pl-1 md:last:pr-1"
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
