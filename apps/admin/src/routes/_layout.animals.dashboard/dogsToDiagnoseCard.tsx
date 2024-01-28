import { AnimalSmallItem } from "#animals/item.tsx";
import { AnimalSearchParams, AnimalSort } from "#animals/searchParams.ts";
import { HAS_UP_COMMING_DIAGNOSE_CONDITIONS } from "#animals/situation/health.ts";
import { Action } from "#core/actions.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { Empty } from "#core/dataDisplay/empty.tsx";
import { Card } from "#core/layout/card.tsx";
import { Routes } from "#core/navigation.ts";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./route";

export function DogsToDiagnoseCard() {
  const { dogToDiagnoseCount, dogsToDiagnose } = useLoaderData<loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {dogToDiagnoseCount === 0
            ? "Diagnoses à prévoir"
            : dogToDiagnoseCount > 1
              ? `${dogToDiagnoseCount} diagnoses à prévoir`
              : "1 diagnose à prévoir"}
        </Card.Title>

        {dogToDiagnoseCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.search.toString(),
                search: AnimalSearchParams.stringify({
                  birthdateEnd: DateTime.now()
                    .minus({
                      months: HAS_UP_COMMING_DIAGNOSE_CONDITIONS.ageInMonths,
                    })
                    .toISODate(),
                  diagnosis: new Set(
                    HAS_UP_COMMING_DIAGNOSE_CONDITIONS.diagnosis,
                  ),
                  sort: AnimalSort.PICK_UP,
                  species: new Set(HAS_UP_COMMING_DIAGNOSE_CONDITIONS.species),
                  statuses: new Set(HAS_UP_COMMING_DIAGNOSE_CONDITIONS.status),
                }),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasListItems>
        {dogToDiagnoseCount === 0 ? (
          <Empty
            isCompact
            icon="🛡️"
            iconAlt="Bouclier"
            title="Aucune diagnose"
            message="À leur 8 mois, une diagnose doit être faite à certains chiens."
            titleElementType="h3"
            className="h-full"
          />
        ) : (
          <ul className="grid grid-cols-1">
            {dogsToDiagnose.map((animal) => (
              <li key={animal.id} className="flex flex-col">
                <AnimalSmallItem
                  animal={animal}
                  secondaryLabel={animal.breed?.name ?? "Race inconnue"}
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
