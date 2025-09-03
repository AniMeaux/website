import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

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
            {application.desiredStandSize.label}
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
