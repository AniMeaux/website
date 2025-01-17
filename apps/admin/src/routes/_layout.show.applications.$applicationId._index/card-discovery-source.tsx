import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardDiscoverySource() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Source</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem
            isLightIcon
            icon={<Icon href="icon-people-arrows-light" />}
          >
            {application.discoverySource}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}
