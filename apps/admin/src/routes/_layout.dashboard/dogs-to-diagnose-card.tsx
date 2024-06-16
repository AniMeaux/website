import { AnimalSmallItem } from "#animals/item";
import {
  AnimalSearchParams,
  AnimalSort,
  AnimalSortSearchParams,
} from "#animals/search-params";
import { HAS_UP_COMMING_DIAGNOSE_CONDITIONS } from "#animals/situation/health";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Empty } from "#core/data-display/empty";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
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
                pathname: Routes.animals.toString(),
                search: (() => {
                  const searchParams = AnimalSearchParams.create({
                    birthdateEnd: DateTime.now()
                      .minus({
                        months: HAS_UP_COMMING_DIAGNOSE_CONDITIONS.ageInMonths,
                      })
                      .toJSDate(),
                    diagnosis: new Set(
                      HAS_UP_COMMING_DIAGNOSE_CONDITIONS.diagnosis,
                    ),
                    species: new Set(
                      HAS_UP_COMMING_DIAGNOSE_CONDITIONS.species,
                    ),
                    statuses: new Set(
                      HAS_UP_COMMING_DIAGNOSE_CONDITIONS.status,
                    ),
                  });

                  AnimalSortSearchParams.set(searchParams, {
                    sort: AnimalSort.PICK_UP,
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
