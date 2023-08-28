import { Action } from "#core/actions.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { Paginator } from "#core/controllers/paginator.tsx";
import { Empty } from "#core/dataDisplay/empty.tsx";
import { db } from "#core/db.server.ts";
import { Card } from "#core/layout/card.tsx";
import { PageLayout } from "#core/layout/page.tsx";
import { Routes } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { prisma } from "#core/prisma.server.ts";
import { PageSearchParams } from "#core/searchParams.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { EventItem } from "#events/item.tsx";
import type { Prisma } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils";

const EVENT_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = PageSearchParams.parse(searchParams);

  const where: Prisma.EventWhereInput = {
    endDate: { gte: new Date() },
  };

  const { events, totalCount } = await promiseHash({
    totalCount: prisma.event.count({ where }),

    events: prisma.event.findMany({
      skip: pageSearchParams.page * EVENT_COUNT_PER_PAGE,
      take: EVENT_COUNT_PER_PAGE,
      orderBy: [
        { startDate: "asc" },
        // If two events start at the same time, display the one that ends the
        // earliest first.
        { endDate: "asc" },
      ],
      where,
      select: {
        endDate: true,
        id: true,
        image: true,
        isFullDay: true,
        isVisible: true,
        location: true,
        startDate: true,
        title: true,
      },
    }),
  });

  const pageCount = Math.ceil(totalCount / EVENT_COUNT_PER_PAGE);

  return json({ totalCount, pageCount, events });
}

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Événements") }];
};

export default function Route() {
  const { totalCount, pageCount, events } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col">
        <Card>
          <Card.Header>
            <Card.Title>
              {totalCount}{" "}
              {totalCount > 1 ? "événements à venir" : "événement à venir"}
            </Card.Title>

            <Action asChild variant="text">
              <BaseLink to={Routes.events.new.toString()}>Créer</BaseLink>
            </Action>
          </Card.Header>

          <Card.Content>
            {events.length > 0 ? (
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1 md:gap-2">
                {events.map((event, index) => (
                  <li key={event.id} className="flex">
                    <EventItem
                      event={event}
                      imageSizes={{ default: "300px" }}
                      imageLoading={index < 15 ? "eager" : "lazy"}
                      className="w-full"
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <Empty
                isCompact
                icon="🛋️"
                iconAlt="Canapé et lampe"
                title="Aucun évènement à venir"
                message="Pour l’instant ;)"
                titleElementType="h3"
              />
            )}
          </Card.Content>

          {pageCount > 1 ? (
            <Card.Footer>
              <Paginator pageCount={pageCount} />
            </Card.Footer>
          ) : null}
        </Card>
      </PageLayout.Content>
    </PageLayout>
  );
}
