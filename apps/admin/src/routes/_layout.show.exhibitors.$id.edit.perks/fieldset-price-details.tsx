import { useLoaderData } from "@remix-run/react"

import { Card } from "#i/core/layout/card.js"
import { ParticipationReceipt } from "#i/show/exhibitors/participation-receipt.js"

import { useForm } from "./form.js"
import type { loader } from "./loader.server.js"

export function FieldsetPriceDetails() {
  const { exhibitor } = useLoaderData<typeof loader>()

  const { fields } = useForm()

  const breakfastPeopleCountSaturday = Number(
    fields.breakfastPeopleCountSaturday.value,
  )
  const breakfastPeopleCountSunday = Number(
    fields.breakfastPeopleCountSunday.value,
  )

  return (
    <Card>
      <Card.Header>
        <Card.Title>Prix estimé de la prestation</Card.Title>
      </Card.Header>

      <Card.Content>
        <ParticipationReceipt
          standSize={exhibitor.size}
          exhibitorCategory={exhibitor.category}
          hasCorner={exhibitor.hasCorner}
          tableCount={exhibitor.tableCount}
          hasTableCloths={exhibitor.hasTableCloths}
          breakfastPeopleCountSaturday={breakfastPeopleCountSaturday}
          breakfastPeopleCountSunday={breakfastPeopleCountSunday}
          peopleCount={exhibitor.peopleCount}
        />
      </Card.Content>
    </Card>
  )
}
