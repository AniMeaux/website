import { GENDER_ICON } from "#animals/gender";
import { AnimalSearchParams } from "#animals/search-params";
import { Action } from "#core/actions";
import { useConfig } from "#core/config";
import { BlockHelper } from "#core/data-display/helper";
import type { DynamicImageProps, ImageSize } from "#core/data-display/image";
import { BaseImage, createCloudinaryUrl } from "#core/data-display/image";
import { db } from "#core/db.server";
import type { RouteHandle } from "#core/handles";
import { Spinner } from "#core/loaders/spinner";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { Icon } from "#generated/icon";
import { cn, fromPrismaPromise } from "@animeaux/core";
import { Gender, UserGroup } from "@prisma/client";
import type {
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import chunk from "lodash.chunk";
import { Suspense } from "react";

export const handle: RouteHandle = {
  htmlBackgroundColor: cn("bg-gray-50 print:bg-white"),
};

const MAX_ITEM_PER_PAGES = 35;
const MAX_PAGES = 5;
const MAX_ANIMAL_COUNT = MAX_ITEM_PER_PAGES * MAX_PAGES;

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = AnimalSearchParams.parse(
    new URL(request.url).searchParams,
  );

  const { where, orderBy } = await db.animal.createFindManyParams(searchParams);

  const totalCount = prisma.animal.count({ where });
  const animals = prisma.animal.findMany({
    orderBy,
    where,
    take: MAX_ANIMAL_COUNT,
    select: {
      avatar: true,
      gender: true,
      id: true,
      name: true,
    },
  });

  return defer({
    totalCount: await totalCount,
    animals: fromPrismaPromise(animals),
  });
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Exports d’animaux") }];
};

export default function Route() {
  const { animals, totalCount } = useLoaderData<typeof loader>();

  return (
    <main className="grid grid-cols-1 gap-1 py-1 md:gap-2 md:py-2 print:gap-0 print:py-0 md:print:gap-0 md:print:py-0">
      {totalCount > MAX_ANIMAL_COUNT ? (
        <div className="grid grid-cols-1 px-1 md:px-2 print:hidden">
          <BlockHelper variant="warning">
            Pour des raisons de performance, seulement {MAX_ANIMAL_COUNT}{" "}
            animaux sur {totalCount} sont affichés.
          </BlockHelper>
        </div>
      ) : null}

      <div className="grid grid-cols-1 justify-items-end px-1 md:px-2 print:hidden">
        <Action onClick={() => window.print()}>
          <Action.Icon href="icon-print" />
          Imprimer
        </Action>
      </div>

      <Suspense
        fallback={
          <PageSection>
            <CardList>
              <li>
                <Spinner className="text-[40px]" />
              </li>
            </CardList>
          </PageSection>
        }
      >
        <Await resolve={animals}>
          {(animals) =>
            chunk(
              animals,
              Math.ceil(
                animals.length / Math.ceil(animals.length / MAX_ITEM_PER_PAGES),
              ),
            ).map((animals, index) => <Page key={index} animals={animals} />)
          }
        </Await>
      </Suspense>
    </main>
  );
}

function Page({
  animals,
}: {
  animals: Awaited<SerializeFrom<typeof loader>["animals"]>;
}) {
  let itemWidth = 400;
  let fallbackSize: ImageSize = "512";

  if (animals.length >= 31) {
    itemWidth = 136;
    fallbackSize = "256";
  } else if (animals.length >= 25) {
    itemWidth = 145;
    fallbackSize = "256";
  } else if (animals.length >= 21) {
    itemWidth = 163;
    fallbackSize = "256";
  } else if (animals.length >= 16) {
    itemWidth = 197;
    fallbackSize = "256";
  } else if (animals.length >= 13) {
    itemWidth = 199;
    fallbackSize = "256";
  } else if (animals.length >= 10) {
    itemWidth = 254;
  } else if (animals.length >= 7) {
    itemWidth = 282;
  } else if (animals.length >= 5) {
    itemWidth = 346;
  }

  return (
    <PageSection>
      <CardList>
        {animals.map((animal) => (
          <AnimalItem
            key={animal.id}
            animal={animal}
            imageSize={fallbackSize}
            width={itemWidth}
          />
        ))}
      </CardList>
    </PageSection>
  );
}

function PageSection({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"section">) {
  return (
    <section
      {...rest}
      className={cn(
        "grid grid-cols-[auto] justify-items-center overflow-auto scrollbars-none",
        className,
      )}
    >
      <div className="flex px-1 md:px-2 print:px-0 md:print:px-0">
        {children}
      </div>
    </section>
  );
}

function CardList({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      {...rest}
      className={cn(
        "flex aspect-A4-landscape w-[29.6cm] flex-wrap content-center justify-center gap-2 bg-white p-2",
      )}
    />
  );
}

function AnimalItem({
  animal,
  imageSize,
  width,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"li"> & {
  animal: Awaited<SerializeFrom<typeof loader>["animals"]>[number];
  imageSize: DynamicImageProps["fallbackSize"];
  width: number;
}) {
  const config = useConfig();

  return (
    <li
      {...rest}
      className={cn("grid flex-none grid-cols-1 gap-0.5", className)}
      style={{ width }}
    >
      <BaseImage
        src={createCloudinaryUrl(config.cloudinaryName, animal.avatar, {
          size: imageSize,
          aspectRatio: "4:3",
        })}
        alt={animal.name}
        aspectRatio="4:3"
        className="w-full rounded-1"
      />

      <p className="grid auto-cols-fr grid-flow-col grid-cols-[auto] gap-0.25 text-body-emphasis">
        <span
          className={cn(
            "flex h-2 items-center",
            animal.gender === Gender.FEMALE ? "text-pink-500" : "text-blue-500",
          )}
        >
          <Icon href={GENDER_ICON[animal.gender]} />
        </span>

        <span className="truncate">{animal.name}</span>
      </p>
    </li>
  );
}
