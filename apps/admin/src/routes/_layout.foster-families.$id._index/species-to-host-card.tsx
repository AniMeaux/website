import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "#animals/species";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { BlockItem } from "#core/data-display/block-item";
import { Empty } from "#core/data-display/empty";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SpeciesToHostCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  const speciesToHost = SORTED_SPECIES.filter((species) =>
    fosterFamily.speciesToHost.includes(species),
  );

  return (
    <Card>
      <Card.Header>
        <Card.Title>Peut accueillir</Card.Title>
      </Card.Header>

      <Card.Content>
        {speciesToHost.length === 0 ? (
          <Empty
            isCompact
            message="Ajoutez les espèces pouvant être accueillis pour placer plus facilement des animaux dans cette famille."
            action={
              <Action asChild variant="secondary" color="gray">
                <BaseLink
                  to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
                >
                  Ajouter des espèces
                </BaseLink>
              </Action>
            }
          />
        ) : (
          <div className="grid items-start gap-1 grid-auto-fill-cols-100 md:gap-2">
            {speciesToHost.map((speciesToHost) => (
              <BlockItem.Root key={speciesToHost} color="gray">
                <BlockItem.Icon href={SPECIES_ICON[speciesToHost]} />
                <BlockItem.Label>
                  {SPECIES_TRANSLATION[speciesToHost]}
                </BlockItem.Label>
              </BlockItem.Root>
            ))}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
