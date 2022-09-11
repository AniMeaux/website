import { Prisma } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Paginator } from "~/controllers/paginator";
import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { MapDateToString } from "~/core/dates";
import { prisma } from "~/core/db.server";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { getPage } from "~/core/searchParams";
import { EventItem } from "~/events/item";

// Multiple of 2 and 3 to be nicely displayed.
const EVENT_COUNT_PER_PAGE = 18;

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
  totalCount: number;
  pageCount: number;
  events: Event[];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const where: Prisma.EventWhereInput = {
    isVisible: true,
    endDate: { lt: new Date() },
  };

  const searchParams = new URL(request.url).searchParams;
  const page = getPage(searchParams);

  const [totalCount, events] = await Promise.all([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      skip: page * EVENT_COUNT_PER_PAGE,
      take: EVENT_COUNT_PER_PAGE,
      orderBy: { endDate: "desc" },
      select: eventSelect.select,
    }),
  ]);

  const pageCount = Math.ceil(totalCount / EVENT_COUNT_PER_PAGE);

  return json<LoaderDataServer>({ totalCount, pageCount, events });
};

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Événements passés") });
};

type LoaderDataClient = MapDateToString<LoaderDataServer>;

export default function PastEventsPage() {
  const { totalCount, pageCount, events } = useLoaderData<LoaderDataClient>();

  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header
        className={cn(
          "flex flex-col gap-6",
          "md:flex-row md:items-center md:gap-12"
        )}
      >
        <h1
          className={cn(
            "px-4 text-title-hero-small text-center",
            "md:flex-1 md:px-0 md:text-title-hero-large md:text-left"
          )}
        >
          Événements passés
        </h1>

        {events.length > 0 && (
          <div className="self-center flex-none flex">
            <BaseLink
              to="/evenements"
              className={actionClassNames.standalone()}
            >
              Voir les événements à venir
            </BaseLink>
          </div>
        )}
      </header>

      {totalCount > 0 ? (
        <section className="flex flex-col gap-6">
          <ul
            className={cn(
              "grid grid-cols-1 grid-rows-[auto] gap-6 items-start",
              "xs:grid-cols-2",
              "md:grid-cols-3"
            )}
          >
            {events.map((event) => (
              <EventItem key={event.id} isDisabled event={event} />
            ))}
          </ul>
        </section>
      ) : (
        <section
          className={cn(
            "px-4 py-12 flex flex-col gap-6 items-center text-center text-gray-500",
            "md:px-30 md:py-40"
          )}
        >
          <p className="w-full">Aucun événement à passé pour l’instant.</p>

          <BaseLink to="/evenements" className={actionClassNames.standalone()}>
            Voir les événements à venir
          </BaseLink>
        </section>
      )}

      <Paginator pageCount={pageCount} className="self-center" />
    </main>
  );
}
