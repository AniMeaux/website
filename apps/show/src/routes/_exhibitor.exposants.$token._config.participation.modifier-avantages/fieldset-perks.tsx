import { FieldStepper } from "#core/form-elements/field-stepper";
import { FormLayout } from "#core/layout/form-layout";
import { PerksHelper } from "#exhibitors/perks/helper.js";
import { Price } from "#price/price.js";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "./form";
import { HelperPriceDetails } from "./helper-price-details";
import type { loader } from "./loader.server";

export function FieldsetPerks() {
  const { exhibitor } = useLoaderData<typeof loader>();
  const { fields } = useForm();

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
  );
}
