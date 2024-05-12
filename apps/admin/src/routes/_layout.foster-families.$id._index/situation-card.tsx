import { ItemList } from "#core/data-display/item-list";
import { Card } from "#core/layout/card";
import { ICON_BY_GARDEN, ICON_BY_HOUSING } from "#foster-families/housing";
import { getLongLocation } from "#foster-families/location";
import { FosterFamilyGarden, FosterFamilyHousing } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SituationCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList.List>
          <ItemList.Item>
            <ItemList.Icon href={ICON_BY_HOUSING[fosterFamily.housing]} />
            <ItemList.Label>
              {TEXT_BY_HOUSING[fosterFamily.housing]}
            </ItemList.Label>
          </ItemList.Item>

          {fosterFamily.garden !== FosterFamilyGarden.UNKNOWN ? (
            <ItemList.Item>
              <ItemList.Icon href={ICON_BY_GARDEN[fosterFamily.garden]} />
              <ItemList.Label>
                {TEXT_BY_GARDEN[fosterFamily.garden]}
              </ItemList.Label>
            </ItemList.Item>
          ) : null}

          <ItemList.Item>
            <ItemList.Icon href="icon-location-dot" />
            <ItemList.Label>{getLongLocation(fosterFamily)}</ItemList.Label>
          </ItemList.Item>
        </ItemList.List>
      </Card.Content>
    </Card>
  );
}

const TEXT_BY_HOUSING: Record<FosterFamilyHousing, string> = {
  [FosterFamilyHousing.FLAT]: "Appartement",
  [FosterFamilyHousing.HOUSE]: "Maison",
  [FosterFamilyHousing.OTHER]: "Autre type de logement",
  [FosterFamilyHousing.UNKNOWN]: "Type de logement inconnu",
};

const TEXT_BY_GARDEN: Record<Exclude<FosterFamilyGarden, "UNKNOWN">, string> = {
  [FosterFamilyGarden.NO]: "Sans jardin",
  [FosterFamilyGarden.YES]: "Avec jardin",
};
