import { AnimalItem } from "#animals/item";
import { AnimalSearchParams } from "#animals/search-params";
import { ACTIVE_ANIMAL_STATUS } from "#animals/status";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { SimpleEmpty } from "#core/data-display/empty";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function ManagedAnimalsCard() {
  const { currentUser, animal } = useLoaderData<typeof loader>();

  if (animal == null || !animal.isCurrentUserManager) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {animal.managedCount === 0
            ? "À votre charge"
            : animal.managedCount > 1
              ? `${animal.managedCount} animaux à votre charge`
              : "1 animal à votre charge"}
        </Card.Title>

        {animal.managedCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.toString(),
                search: AnimalSearchParams.format({
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

      <Card.Content hasHorizontalScroll={animal.managedCount > 0}>
        {animal.managedCount === 0 || animal.managed == null ? (
          <SimpleEmpty
            isCompact
            icon="🦤"
            iconAlt="Dodo bird"
            title="Aucun animal à votre charge"
            titleElementType="h3"
            message="Pour l’instant ;)"
          />
        ) : (
          <ul className="flex">
            {animal.managed.map((animal) => (
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
