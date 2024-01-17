import { Action } from "#core/actions.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { Paginator } from "#core/controllers/paginator.tsx";
import { Chip } from "#core/dataDisplay/chip.tsx";
import { Empty } from "#core/dataDisplay/empty.tsx";
import type { DynamicImageProps } from "#core/dataDisplay/image.tsx";
import { DynamicImage } from "#core/dataDisplay/image.tsx";
import { db } from "#core/db.server.ts";
import { Card } from "#core/layout/card.tsx";
import { PageLayout } from "#core/layout/page.tsx";
import { Routes } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { prisma } from "#core/prisma.server.ts";
import { PageSearchParams } from "#core/searchParams.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { cn, formatDateRange } from "@animeaux/core";
import type { Prisma } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
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

          <Card.Content hasListItems>
            {events.length > 0 ? (
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] items-start">
                {events.map((event, index) => (
                  <li key={event.id} className="flex">
                    <EventItem
                      event={event}
                      imageSizeMapping={{ default: "300px" }}
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

function EventItem({
  event,
  imageSizeMapping,
  imageLoading,
  className,
}: {
  event: SerializeFrom<typeof loader>["events"][number];
  imageSizeMapping: DynamicImageProps["sizeMapping"];
  imageLoading?: DynamicImageProps["loading"];
  className?: string;
}) {
  return (
    <BaseLink
      to={Routes.events.id(event.id).toString()}
      className={cn(
        "rounded-1 flex flex-col p-0.5 md:p-1 gap-0.5 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 bg-white hover:bg-gray-100 focus-visible:z-10",
        className,
      )}
    >
      <span className="relative flex flex-col">
        <DynamicImage
          loading={imageLoading}
          imageId={event.image}
          alt={event.title}
          fallbackSize="512"
          sizeMapping={imageSizeMapping}
          className="w-full flex-none rounded-1"
        />

        {!event.isVisible ? (
          <span className="absolute bottom-0 left-0 w-full p-0.5 flex">
            <Chip
              color="orange"
              icon="eyeSlash"
              title="L’évènement n’est pas visible."
            />
          </span>
        ) : null}
      </span>

      <div className="flex flex-col">
        <p className="text-caption-default text-gray-500">
          {formatDateRange(event.startDate, event.endDate, {
            showTime: !event.isFullDay,
          })}
        </p>

        <p className="text-body-emphasis">{event.title}</p>

        <p className="text-caption-default text-gray-500">{event.location}</p>
      </div>
    </BaseLink>
  );
}
