import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Paginator } from "#core/controllers/paginator";
import { Chip } from "#core/data-display/chip";
import { Empty } from "#core/data-display/empty";
import type { DynamicImageProps } from "#core/data-display/image";
import { DynamicImage } from "#core/data-display/image";
import { db } from "#core/db.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import { PageSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { cn, formatDateRange } from "@animeaux/core";
import type { Prisma } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type {
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";

const EVENT_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderFunctionArgs) {
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

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Événements") }];
};

export default function Route() {
  const { totalCount, pageCount, events } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Root>
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
    </PageLayout.Root>
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
        "flex flex-col gap-0.5 rounded-1.5 bg-white p-0.5 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:rounded-2 md:p-1",
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
          <span className="absolute bottom-0 left-0 flex w-full p-0.5">
            <Chip
              variant="filled"
              color="orange"
              icon="icon-eye-slash-solid"
              title="L’évènement n’est pas visible."
            />
          </span>
        ) : null}
      </span>

      <div className="flex flex-col">
        <p className="text-gray-500 text-caption-default">
          {formatDateRange(event.startDate, event.endDate, {
            showTime: !event.isFullDay,
          })}
        </p>

        <p className="text-body-emphasis">{event.title}</p>

        <p className="text-gray-500 text-caption-default">{event.location}</p>
      </div>
    </BaseLink>
  );
}
