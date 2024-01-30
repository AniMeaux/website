import { SPECIES_TRANSLATION } from "#animals/species";
import { Action } from "#core/actions";
import { BaseLink } from "#core/baseLink";
import { ItemList, SimpleItem } from "#core/dataDisplay/item";
import { HIGHLIGHT_COMPONENTS, Markdown } from "#core/dataDisplay/markdown";
import { joinReactNodes } from "#core/joinReactNodes";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import {
  AVAILABILITY_TRANSLATION,
  AvailabilityIcon,
} from "#fosterFamilies/availability";
import { ICON_BY_GARDEN, ICON_BY_HOUSING } from "#fosterFamilies/housing";
import { Icon } from "#generated/icon";
import {
  FosterFamilyAvailability,
  FosterFamilyGarden,
  FosterFamilyHousing,
} from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./route";

export function SituationCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>

        <Action asChild variant="text">
          <BaseLink
            to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem
            icon={<AvailabilityIcon availability={fosterFamily.availability} />}
          >
            {fosterFamily.availability === FosterFamilyAvailability.UNKNOWN ? (
              <>
                Disponibilité{" "}
                <strong className="text-body-emphasis">
                  {AVAILABILITY_TRANSLATION[fosterFamily.availability]}
                </strong>
              </>
            ) : (
              <>
                Est{" "}
                <strong className="text-body-emphasis">
                  {AVAILABILITY_TRANSLATION[fosterFamily.availability]}
                </strong>
                {fosterFamily.availabilityExpirationDate != null ? (
                  <>
                    {" "}
                    jusqu’au{" "}
                    <strong className="text-body-emphasis">
                      {DateTime.fromISO(
                        fosterFamily.availabilityExpirationDate,
                      ).toLocaleString(DateTime.DATE_FULL)}
                    </strong>
                  </>
                ) : null}
              </>
            )}
          </SimpleItem>

          <SimpleItem icon={<Icon id="handHoldingHeart" />}>
            Peut accueillir :{" "}
            {fosterFamily.speciesToHost.length === 0 ? (
              <strong className="text-body-emphasis">Inconnu</strong>
            ) : (
              joinReactNodes(
                fosterFamily.speciesToHost.map((species) => (
                  <strong key={species} className="text-body-emphasis">
                    {SPECIES_TRANSLATION[species]}
                  </strong>
                )),
                ", ",
              )
            )}
          </SimpleItem>

          <SimpleItem icon={<Icon id="houseChimneyPaw" />}>
            {fosterFamily.speciesAlreadyPresent.length === 0 ? (
              "Aucun animal déjà présents"
            ) : (
              <>
                Sont déjà présents :{" "}
                {joinReactNodes(
                  fosterFamily.speciesAlreadyPresent.map((species) => (
                    <strong key={species} className="text-body-emphasis">
                      {SPECIES_TRANSLATION[species]}
                    </strong>
                  )),
                  ", ",
                )}
              </>
            )}
          </SimpleItem>

          <SimpleItem icon={ICON_BY_HOUSING[fosterFamily.housing]}>
            <Markdown components={HIGHLIGHT_COMPONENTS}>
              {TEXT_BY_HOUSING[fosterFamily.housing]}
            </Markdown>
          </SimpleItem>

          <SimpleItem icon={ICON_BY_GARDEN[fosterFamily.garden]}>
            <Markdown components={HIGHLIGHT_COMPONENTS}>
              {TEXT_BY_GARDEN[fosterFamily.garden]}
            </Markdown>
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

const TEXT_BY_HOUSING: Record<FosterFamilyHousing, string> = {
  [FosterFamilyHousing.FLAT]: "Vie en **appartement**",
  [FosterFamilyHousing.HOUSE]: "Vie en **maison**",
  [FosterFamilyHousing.OTHER]: "**Autre** type de logement",
  [FosterFamilyHousing.UNKNOWN]: "Type de logement **inconnu**",
};

const TEXT_BY_GARDEN: Record<FosterFamilyGarden, string> = {
  [FosterFamilyGarden.NO]: "N’a pas de **jardin**",
  [FosterFamilyGarden.UNKNOWN]: "Présence d’un jardin **inconnue**",
  [FosterFamilyGarden.YES]: "A un **jardin**",
};
