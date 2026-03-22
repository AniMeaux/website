import { useLoaderData } from "@remix-run/react"

import { ItemList, SimpleItem } from "#i/core/data-display/item.js"
import { Card } from "#i/core/layout/card.js"
import {
  SponsorshipCategoryIcon,
  SponsorshipOptionalCategory,
} from "#i/show/sponsors/category.js"

import type { loader } from "./loader.server.js"

export function CardSponsorship() {
  const { application } = useLoaderData<typeof loader>()

  return (
    <Card>
      <Card.Header>
        <Card.Title>Sponsor</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem
            isLightIcon
            icon={
              <SponsorshipCategoryIcon
                category={application.sponsorshipCategory}
              />
            }
          >
            {
              SponsorshipOptionalCategory.translation[
                application.sponsorshipCategory
              ]
            }
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  )
}
