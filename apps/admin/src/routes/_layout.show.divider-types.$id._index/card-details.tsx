import { useLoaderData } from "@remix-run/react"

import { ItemList, SimpleItem } from "#i/core/data-display/item.js"
import { Card } from "#i/core/layout/card.js"
import { Icon } from "#i/generated/icon.js"

import type { loader } from "./loader.server.js"

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
  )
}

function ItemMaxCount() {
  const { dividerType } = useLoaderData<typeof loader>()

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-fence-light" />}>
      <strong className="text-body-emphasis">
        {dividerType.maxCount} cloison{dividerType.maxCount > 1 ? "s" : null}
      </strong>{" "}
      maximum
    </SimpleItem>
  )
}
