import { useLoaderData } from "@remix-run/react"

import { ItemList, SimpleItem } from "#i/core/data-display/item.js"
import { Card } from "#i/core/layout/card.js"
import { Icon } from "#i/generated/icon.js"
import { DiscoverySource } from "#i/show/exhibitors/applications/discovery-source.js"

import type { loader } from "./loader.server.js"

export function CardDiscoverySource() {
  const { application } = useLoaderData<typeof loader>()

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
            {DiscoverySource.getVisibleValue(application)}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  )
}
