import { useLoaderData } from "@remix-run/react"

import { ItemList, SimpleItem } from "#i/core/data-display/item.js"
import { Card } from "#i/core/layout/card.js"
import { formatAvailability } from "#i/show/divider-type/availability.js"
import { DividerTypeAvailabilityIcon } from "#i/show/divider-type/availability-icon.js"

import type { loader } from "./loader.server"

export function CardSituation() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <ItemAvailability />
        </ItemList>
      </Card.Content>
    </Card>
  )
}

function ItemAvailability() {
  const { dividerType } = useLoaderData<typeof loader>()

  return (
    <SimpleItem
      isLightIcon
      icon={<DividerTypeAvailabilityIcon dividerType={dividerType} />}
    >
      Utilisation :{" "}
      <strong className="text-body-emphasis">
        {formatAvailability(dividerType)}
      </strong>
    </SimpleItem>
  )
}
