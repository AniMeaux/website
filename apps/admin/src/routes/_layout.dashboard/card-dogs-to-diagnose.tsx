import { AnimalSmallItem } from "#i/animals/item";
import {
  AnimalSearchParams,
  AnimalSort,
  AnimalSortSearchParams,
} from "#i/animals/search-params";
import { HAS_UP_COMMING_DIAGNOSE_CONDITIONS } from "#i/animals/situation/health";
import { Action } from "#i/core/actions";
import { BaseLink } from "#i/core/base-link";
import { SimpleEmpty } from "#i/core/data-display/empty";
import { Card } from "#i/core/layout/card";
import { Routes } from "#i/core/navigation";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./loader.server";

export function CardDogsToDiagnose() {
  const { animal } = useLoaderData<typeof loader>();

  if (animal == null) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {animal.dogToDiagnoseCount === 0
            ? "Diagnoses à prévoir"
            : animal.dogToDiagnoseCount > 1
              ? `${animal.dogToDiagnoseCount} diagnoses à prévoir`
              : "1 diagnose à prévoir"}
        </Card.Title>

        {animal.dogToDiagnoseCount > 0 ? (
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
        {animal.dogToDiagnoseCount === 0 ? (
          <SimpleEmpty
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
            {animal.dogsToDiagnose.map((animal) => (
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
