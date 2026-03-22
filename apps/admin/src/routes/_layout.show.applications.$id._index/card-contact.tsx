import { useLoaderData } from "@remix-run/react"

import { ItemList, SimpleItem } from "#i/core/data-display/item.js"
import { Card } from "#i/core/layout/card.js"
import { Icon } from "#i/generated/icon.js"

import type { loader } from "./loader.server.js"

export function CardContact() {
  const { application } = useLoaderData<typeof loader>()

  return (
    <Card>
      <Card.Header>
        <Card.Title>Contact</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem isLightIcon icon={<Icon href="icon-user-light" />}>
            {application.contactFirstname} {application.contactLastname}
          </SimpleItem>

          <SimpleItem isLightIcon icon={<Icon href="icon-envelope-light" />}>
            {application.contactEmail}
          </SimpleItem>

          <SimpleItem isLightIcon icon={<Icon href="icon-phone-light" />}>
            {application.contactPhone}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  )
}
