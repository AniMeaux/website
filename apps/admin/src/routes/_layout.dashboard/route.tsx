import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import type { MetaFunction } from "@remix-run/node";
import { CardActiveAnimals } from "./card-active-animals";
import { CardAnimalsToSterilize } from "./card-animals-to-sterilize";
import { CardAnimalsToVaccinate } from "./card-animals-to-vaccinate";
import { CardDogsToDiagnose } from "./card-dogs-to-diagnose";
import { CardManagedAnimals } from "./card-managed-animals";
import { CardStandSizeBooking } from "./card-stand-size-booking";
import { CardUntreatedApplications } from "./card-untreated-applications";

export { loader } from "./loader.server";

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Tableau de bord") }];
};

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
  );
}
