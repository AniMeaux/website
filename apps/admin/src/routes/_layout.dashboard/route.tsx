import type { MetaFunction } from "@remix-run/node"

import { PageLayout } from "#i/core/layout/page.js"
import { getPageTitle } from "#i/core/page-title.js"

import { CardActiveAnimals } from "./card-active-animals.js"
import { CardAnimalsToSterilize } from "./card-animals-to-sterilize.js"
import { CardAnimalsToVaccinate } from "./card-animals-to-vaccinate.js"
import { CardDogsToDiagnose } from "./card-dogs-to-diagnose.js"
import { CardManagedAnimals } from "./card-managed-animals.js"
import { CardStandSizeBooking } from "./card-stand-size-booking.js"
import { CardUntreatedApplications } from "./card-untreated-applications.js"

export { loader } from "./loader.server.js"

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Tableau de bord") }]
}

export default function Route() {
  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        <section className="grid grid-cols-1 gap-1 empty:hidden md:grid-cols-3 md:gap-2">
          <CardAnimalsToVaccinate />
          <CardAnimalsToSterilize />
          <CardDogsToDiagnose />
        </section>

        <CardManagedAnimals />

        <CardActiveAnimals />

        <section className="grid grid-cols-1 gap-1 empty:hidden md:grid-cols-2 md:gap-2">
          <CardUntreatedApplications />
          <CardStandSizeBooking />
        </section>
      </PageLayout.Content>
    </PageLayout.Root>
  )
}
