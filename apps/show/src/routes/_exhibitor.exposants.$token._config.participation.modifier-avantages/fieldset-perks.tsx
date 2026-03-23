import { useLoaderData } from "@remix-run/react"

import { FieldStepper } from "#i/core/form-elements/field-stepper.js"
import { FormLayout } from "#i/core/layout/form-layout.js"
import { PerksHelper } from "#i/exhibitors/perks/helper.js"
import { Price } from "#i/price/price.js"

import { useForm } from "./form.js"
import { HelperPriceDetails } from "./helper-price-details.js"
import type { loader } from "./loader.server.js"

export function FieldsetPerks() {
  const { exhibitor } = useLoaderData<typeof loader>()
  const { fields } = useForm()

  return (
    <FormLayout.Section>
      <FormLayout.Title>Avantages</FormLayout.Title>

      <PerksHelper />

      <FieldStepper
        label="Nombre de personnes pour le petit-déjeuner du samedi"
        field={fields.breakfastPeopleCountSaturday}
        minValue={0}
        maxValue={exhibitor.peopleCount}
        helper={
          <FormLayout.Helper>
            Option à{" "}
            {Price.format(
              Number(CLIENT_ENV.PRICE_BREAKFAST_PER_PERSON_PER_DAY),
            )}{" "}
            par personne
          </FormLayout.Helper>
        }
      />

      <FieldStepper
        label="Nombre de personnes pour le petit-déjeuner du dimanche"
        field={fields.breakfastPeopleCountSunday}
        minValue={0}
        maxValue={exhibitor.peopleCount}
        helper={
          <FormLayout.Helper>
            Option à{" "}
            {Price.format(
              Number(CLIENT_ENV.PRICE_BREAKFAST_PER_PERSON_PER_DAY),
            )}{" "}
            par personne
          </FormLayout.Helper>
        }
      />

      <FieldStepper
        label="Nombre de personnes pour le verre de l’amitié du samedi soir"
        field={fields.appetizerPeopleCount}
        minValue={0}
        maxValue={exhibitor.peopleCount}
        helper={<FormLayout.Helper>Gratuit • Dès 18h30</FormLayout.Helper>}
      />

      <HelperPriceDetails />
    </FormLayout.Section>
  )
}
