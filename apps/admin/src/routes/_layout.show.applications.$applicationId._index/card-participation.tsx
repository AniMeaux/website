import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { STAND_SIZE_TRANSLATION } from "#show/applications/stand-size";
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
          <SimpleItem icon={<Icon href="icon-expand" />}>
            {STAND_SIZE_TRANSLATION[application.desiredStandSize]}
          </SimpleItem>

          <SimpleItem icon={<Icon href="icon-microphone-stand" />}>
            {application.proposalForOnStageEntertainment ??
              "Aucune proposition d’animation sur scène"}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}
