import { Tab, Tabs } from "#core/controllers/tabs";
import { Routes } from "#core/navigation";
import { cn } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionTabs() {
  const { exhibitor } = useLoaderData<typeof loader>();

  const routes = Routes.exhibitors.token(exhibitor.token);

  return (
    <section
      className={cn(
        "grid grid-cols-1 overflow-auto pt-4 scrollbars-none",
        // Use this trick so the focus outlines aren't cropped by
        // overflow-hidden.
        "-mb-1 pb-1",
      )}
    >
      <Tabs className="min-w-max">
        <div className="grid grid-cols-1 pl-safe-page-narrow md:pl-safe-page-normal">
          <Tab to={routes.toString()} end>
            Tableau de bord
          </Tab>
        </div>

        <Tab to={routes.profile.toString()}>Profil</Tab>

        <Tab to={routes.documents.toString()}>Documents et Structure</Tab>

        <Tab to={routes.participation.toString()}>Participation</Tab>

        <div className="grid grid-cols-1 pr-safe-page-narrow md:pr-safe-page-normal">
          <Tab to={routes.invoice.toString()}>Facturation</Tab>
        </div>
      </Tabs>
    </section>
  );
}
