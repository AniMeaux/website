import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ActiveAnimalsCard } from "./active-animals-card";
import { AnimalsToSterilizeCard } from "./animals-to-sterilize-card";
import { AnimalsToVaccinateCard } from "./animals-to-vaccinate-card";
import { DogsToDiagnoseCard } from "./dogs-to-diagnose-card";
import type { loader } from "./loader.server";
import { ManagedAnimalsCard } from "./managed-animals-card";

export { loader } from "./loader.server";

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Tableau de bord") }];
};

export default function Route() {
  const { isCurrentUserManager } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        <section className="grid grid-cols-1 gap-1 md:grid-cols-3 md:gap-2">
          <AnimalsToVaccinateCard />
          <AnimalsToSterilizeCard />
          <DogsToDiagnoseCard />
        </section>

        {isCurrentUserManager ? <ManagedAnimalsCard /> : null}
        <ActiveAnimalsCard />
      </PageLayout.Content>
    </PageLayout.Root>
  );
}
