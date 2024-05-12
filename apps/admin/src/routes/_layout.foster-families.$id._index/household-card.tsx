import { AnimalSmallItem } from "#animals/item";
import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "#animals/species";
import { InlineHelper } from "#core/data-display/helper";
import { ItemList } from "#core/data-display/item-list";
import { joinReactNodes } from "#core/join-react-nodes";
import { Card, SubCard } from "#core/layout/card";
import { Separator } from "#core/layout/separator";
import { FosterFamilyAvailability } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./route";

export function HouseholdCard() {
  const { fosterFamily, fosterAnimals } = useLoaderData<typeof loader>();

  if (
    fosterFamily.speciesAlreadyPresent.length === 0 &&
    fosterAnimals.length === 0
  ) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Foyer</Card.Title>
      </Card.Header>

      <Card.Content>
        <div className="grid grid-cols-1 gap-2">
          {joinReactNodes(
            [
              fosterFamily.speciesAlreadyPresent.length > 0 ? (
                <SpeciesAlreadyPresentSubCard key="species-already-present" />
              ) : null,
              fosterAnimals.length > 0 ? (
                <FosterAnimalsSubCard key="foster-animals" />
              ) : null,
            ].filter(Boolean),
            <Separator />,
          )}
        </div>
      </Card.Content>
    </Card>
  );
}

function SpeciesAlreadyPresentSubCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  const speciesAlreadyPresent = SORTED_SPECIES.filter((species) =>
    fosterFamily.speciesAlreadyPresent.includes(species),
  );

  return (
    <SubCard.Root>
      <SubCard.Header>
        <SubCard.Title>Animaux de la famille</SubCard.Title>
      </SubCard.Header>

      <SubCard.Content asChild>
        <ItemList.List>
          {speciesAlreadyPresent.map((speciesAlreadyPresent) => (
            <ItemList.Item key={speciesAlreadyPresent}>
              <ItemList.Icon href={SPECIES_ICON[speciesAlreadyPresent]} />
              <ItemList.Label>
                {SPECIES_TRANSLATION[speciesAlreadyPresent]}
              </ItemList.Label>
            </ItemList.Item>
          ))}
        </ItemList.List>
      </SubCard.Content>
    </SubCard.Root>
  );
}

function FosterAnimalsSubCard() {
  const { fosterFamily, fosterAnimals } = useLoaderData<typeof loader>();

  return (
    <SubCard.Root>
      <SubCard.Header>
        <SubCard.Title>Animaux accueillis</SubCard.Title>
      </SubCard.Header>

      <SubCard.Content className="grid grid-cols-1 gap-2">
        {fosterFamily.availability === FosterFamilyAvailability.AVAILABLE &&
        fosterFamily.availabilityExpirationDate != null ? (
          <InlineHelper variant="warning" icon="icon-clock">
            {fosterFamily.displayName} ne sera plus disponible à partir du{" "}
            {DateTime.fromISO(fosterFamily.availabilityExpirationDate)
              .plus({ days: 1 })
              .toLocaleString(DateTime.DATE_FULL)}
            .
          </InlineHelper>
        ) : null}

        {fosterAnimals.map((animal) => (
          <AnimalSmallItem
            key={animal.id}
            animal={animal}
            secondaryLabel={animal.manager?.displayName}
          />
        ))}
      </SubCard.Content>
    </SubCard.Root>
  );
}
