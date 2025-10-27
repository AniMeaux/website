import { actionClassNames } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { prisma } from "#core/db.server";
import {
  RelatedSection,
  RelatedSectionList,
  RelatedSectionTitle,
} from "#core/layout/related-section";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { EventItem } from "#events/item";
import { cn } from "@animeaux/core";
import type { Prisma } from "@animeaux/prisma/client";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";

const eventSelect = {
  id: true,
  image: true,
  title: true,
  url: true,
  description: true,
  startDate: true,
  endDate: true,
  isFullDay: true,
  location: true,
} satisfies Prisma.EventSelect;

const PAST_EVENT_COUNT = 3;

export async function loader() {
  const { events, pastEvents } = await promiseHash({
    events: prisma.event.findMany({
      where: { isVisible: true, endDate: { gte: new Date() } },
      orderBy: [
        { startDate: "asc" },
        // If two events start at the same time, display the one that ends the
        // earliest first.
        { endDate: "asc" },
      ],
      select: eventSelect,
    }),
    pastEvents: prisma.event.findMany({
      where: { isVisible: true, endDate: { lt: new Date() } },
      take: PAST_EVENT_COUNT,
      orderBy: { endDate: "desc" },
      select: eventSelect,
    }),
  });

  return json({ events, pastEvents });
}

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Événements à venir") });
};

export default function Route() {
  const { events, pastEvents } = useLoaderData<typeof loader>();

  return (
    <>
      <main className="flex w-full flex-col gap-12 px-page">
        <header className="flex flex-col">
          <h1
            className={cn(
              "text-center text-title-hero-small",
              "md:flex-1 md:text-left md:text-title-hero-large",
            )}
          >
            Événements à venir
          </h1>
        </header>

        {events.length > 0 ? (
          <section className="flex flex-col gap-6">
            <ul
              className={cn(
                "grid grid-cols-1 items-start gap-12",
                "xs:grid-cols-2",
                "md:grid-cols-3",
              )}
            >
              {events.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </ul>
          </section>
        ) : (
          <section
            className={cn(
              "flex flex-col items-center gap-6 py-12 text-center text-gray-500",
              "md:px-30 md:py-40",
            )}
          >
            <p className="w-full">Aucun événement à venir pour l’instant.</p>

            <BaseLink
              to="/evenements/passes"
              className={actionClassNames.standalone()}
            >
              Voir les événements passés
            </BaseLink>
          </section>
        )}
      </main>

      {pastEvents.length > 0 && (
        <RelatedSection>
          <RelatedSectionTitle>Événements passés</RelatedSectionTitle>

          <RelatedSectionList>
            {pastEvents.map((event) => (
              <EventItem key={event.id} isDisabled event={event} />
            ))}
          </RelatedSectionList>

          <BaseLink
            to="/evenements/passes"
            className={cn(actionClassNames.standalone(), "self-center")}
          >
            Voir plus
          </BaseLink>
        </RelatedSection>
      )}
    </>
  );
}
