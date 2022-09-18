import { Prisma } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { MapDateToString } from "~/core/dates";
import { prisma } from "~/core/db.server";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { EventItem } from "~/events/item";
import {
  RelatedSection,
  RelatedSectionList,
  RelatedSectionTitle,
} from "~/layout/relatedSection";

const eventSelect = Prisma.validator<Prisma.EventArgs>()({
  select: {
    id: true,
    image: true,
    title: true,
    shortDescription: true,
    startDate: true,
    endDate: true,
    isFullDay: true,
    location: true,
  },
});

type Event = Prisma.EventGetPayload<typeof eventSelect>;

type LoaderDataServer = {
  events: Event[];
  pastEvents: Event[];
};

const PAST_EVENT_COUNT = 3;

export const loader: LoaderFunction = async () => {
  const [events, pastEvents] = await Promise.all([
    prisma.event.findMany({
      where: { isVisible: true, endDate: { gte: new Date() } },
      orderBy: { endDate: "asc" },
      select: eventSelect.select,
    }),
    prisma.event.findMany({
      where: { isVisible: true, endDate: { lt: new Date() } },
      take: PAST_EVENT_COUNT,
      orderBy: { endDate: "desc" },
      select: eventSelect.select,
    }),
  ]);

  return json<LoaderDataServer>({ events, pastEvents });
};

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Événements à venir") });
};

type LoaderDataClient = MapDateToString<LoaderDataServer>;

export default function EventsPage() {
  const { events, pastEvents } = useLoaderData<LoaderDataClient>();

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
                "grid grid-cols-1 grid-rows-[auto] gap-12 items-start",
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
