import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import type { MetaFunction } from "@remix-run/node";
import { ActiveAnimalsCard } from "./card-active-animals";
import { AnimalsToSterilizeCard } from "./card-animals-to-sterilize";
import { AnimalsToVaccinateCard } from "./card-animals-to-vaccinate";
import { DogsToDiagnoseCard } from "./card-dogs-to-diagnose";
import { ManagedAnimalsCard } from "./card-managed-animals";

export { loader } from "./loader.server";

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Tableau de bord") }];
};

export default function Route() {
  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        <section className="grid grid-cols-1 gap-1 md:grid-cols-3 md:gap-2">
          <AnimalsToVaccinateCard />
          <AnimalsToSterilizeCard />
          <DogsToDiagnoseCard />
        </section>

        <ManagedAnimalsCard />

        <ActiveAnimalsCard />
      </PageLayout.Content>
    </PageLayout.Root>
  );
}
