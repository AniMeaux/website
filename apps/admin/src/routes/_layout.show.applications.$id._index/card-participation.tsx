import { ProseInlineAction } from "#i/core/actions.js";
import { BaseLink } from "#i/core/base-link.js";
import { ItemList, SimpleItem } from "#i/core/data-display/item";
import { Card } from "#i/core/layout/card";
import { Routes } from "#i/core/navigation.js";
import { Icon } from "#i/generated/icon";
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
            Stand de{" "}
            <ProseInlineAction asChild>
              <BaseLink
                to={Routes.show.standSizes
                  .id(application.desiredStandSize.id)
                  .toString()}
              >
                {application.desiredStandSize.label}
              </BaseLink>
            </ProseInlineAction>
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
