import { actionClassNames } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Paginator } from "#core/controllers/paginator";
import { prisma } from "#core/db.server";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { getPage } from "#core/search-params";
import { EventItem } from "#events/item";
import { cn } from "@animeaux/core";
import type { Prisma } from "@prisma/client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";

// Multiple of 2 and 3 to be nicely displayed.
const EVENT_COUNT_PER_PAGE = 18;

export async function loader({ request }: LoaderFunctionArgs) {
  const where: Prisma.EventWhereInput = {
    isVisible: true,
    endDate: { lt: new Date() },
  };

  const searchParams = new URL(request.url).searchParams;
  const page = getPage(searchParams);

  const { totalCount, events } = await promiseHash({
    totalCount: prisma.event.count({ where }),
    events: prisma.event.findMany({
      where,
      skip: page * EVENT_COUNT_PER_PAGE,
      take: EVENT_COUNT_PER_PAGE,
      orderBy: { endDate: "desc" },
      select: {
        description: true,
        endDate: true,
        id: true,
        image: true,
        isFullDay: true,
        location: true,
        startDate: true,
        title: true,
        url: true,
      },
    }),
  });

  const pageCount = Math.ceil(totalCount / EVENT_COUNT_PER_PAGE);

  return json({ totalCount, pageCount, events });
}

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Événements passés") });
};

export default function Route() {
  const { totalCount, pageCount, events } = useLoaderData<typeof loader>();

  return (
    <main className="flex w-full flex-col gap-12 px-page">
      <header
        className={cn(
          "flex flex-col gap-6",
          "md:flex-row md:items-center md:gap-12",
        )}
      >
        <h1
          className={cn(
            "text-center text-title-hero-small",
            "md:flex-1 md:text-left md:text-title-hero-large",
          )}
        >
          Événements passés
        </h1>

        {events.length > 0 && (
          <div className="flex flex-none self-center">
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
              "grid grid-cols-1 items-start gap-12",
              "xs:grid-cols-2",
              "md:grid-cols-3",
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
            "flex flex-col items-center gap-6 py-12 text-center text-gray-500",
            "md:px-30 md:py-40",
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
