import { actionClassNames } from "#core/actions.ts";
import { BaseLink } from "#core/baseLink.tsx";
import { cn } from "#core/classNames.ts";
import { prisma } from "#core/db.server.ts";
import {
  RelatedSection,
  RelatedSectionList,
  RelatedSectionTitle,
} from "#core/layout/relatedSection.tsx";
import { createSocialMeta } from "#core/meta.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { EventItem } from "#events/item.tsx";
import { Prisma } from "@prisma/client";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils";

const eventSelect = Prisma.validator<Prisma.EventArgs>()({
  select: {
    id: true,
    image: true,
    title: true,
    url: true,
    description: true,
    startDate: true,
    endDate: true,
    isFullDay: true,
    location: true,
  },
});

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
      select: eventSelect.select,
    }),
    pastEvents: prisma.event.findMany({
      where: { isVisible: true, endDate: { lt: new Date() } },
      take: PAST_EVENT_COUNT,
      orderBy: { endDate: "desc" },
      select: eventSelect.select,
    }),
  });

  return json({ events, pastEvents });
}

export const meta: V2_MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Événements à venir") });
};

export default function Route() {
  const { events, pastEvents } = useLoaderData<typeof loader>();

  return (
    <>
      <main className="w-full px-page flex flex-col gap-12">
        <header className="flex flex-col">
          <h1
            className={cn(
              "text-title-hero-small text-center",
              "md:flex-1 md:text-title-hero-large md:text-left"
            )}
          >
            Événements à venir
          </h1>
        </header>

        {events.length > 0 ? (
          <section className="flex flex-col gap-6">
            <ul
              className={cn(
                "grid grid-cols-1 gap-12 items-start",
                "xs:grid-cols-2",
                "md:grid-cols-3"
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
              "py-12 flex flex-col gap-6 items-center text-center text-gray-500",
              "md:px-30 md:py-40"
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
