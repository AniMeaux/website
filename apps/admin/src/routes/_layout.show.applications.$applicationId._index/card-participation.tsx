import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { STAND_SIZE_TRANSLATION } from "#show/exhibitors/stand-configuration/stand-size";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardParticipation() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Participation</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem isLightIcon icon={<Icon href="icon-expand-light" />}>
            {STAND_SIZE_TRANSLATION[application.desiredStandSize]}
          </SimpleItem>

          <SimpleItem
            isLightIcon
            icon={<Icon href="icon-microphone-stand-light" />}
          >
            {application.proposalForOnStageEntertainment ??
              "Aucune proposition d’animation sur scène"}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}
