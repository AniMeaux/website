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

export function ManagedAnimalsCard() {
  const { currentUser, managedAnimalCount, managedAnimals } =
    useLoaderData<loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {managedAnimalCount === 0
            ? "À votre charge"
            : managedAnimalCount > 1
              ? `${managedAnimalCount} animaux à votre charge`
              : "1 animal à votre charge"}
        </Card.Title>

        {managedAnimalCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.search.toString(),
                search: AnimalSearchParams.stringify({
                  statuses: new Set(ACTIVE_ANIMAL_STATUS),
                  managersId: new Set([currentUser.id]),
                }),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasHorizontalScroll={managedAnimalCount > 0}>
        {managedAnimalCount === 0 || managedAnimals == null ? (
          <Empty
            isCompact
            icon="🦤"
            iconAlt="Dodo bird"
            title="Aucun animal à votre charge"
            titleElementType="h3"
            message="Pour l’instant ;)"
          />
        ) : (
          <ul className="flex">
            {managedAnimals.map((animal) => (
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
