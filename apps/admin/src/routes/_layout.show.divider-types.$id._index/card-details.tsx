import { ItemList, SimpleItem } from "#core/data-display/item.js";
import { Card } from "#core/layout/card.js";
import { Icon } from "#generated/icon.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardDetails() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Détails</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <ItemMaxCount />
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function ItemMaxCount() {
  const { dividerType } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-fence-light" />}>
      <strong className="text-body-emphasis">
        {dividerType.maxCount} cloison{dividerType.maxCount > 1 ? "s" : null}
      </strong>{" "}
      maximum
    </SimpleItem>
  );
}
