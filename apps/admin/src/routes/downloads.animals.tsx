import { GENDER_ICON } from "#animals/gender";
import { AnimalSearchParams } from "#animals/searchParams";
import { Action } from "#core/actions";
import { BlockHelper } from "#core/dataDisplay/helper";
import type { DynamicImageProps, ImageSize } from "#core/dataDisplay/image";
import { DynamicImage } from "#core/dataDisplay/image";
import { db } from "#core/db.server";
import type { RouteHandle } from "#core/handles";
import { Spinner } from "#core/loaders/spinner";
import { getPageTitle } from "#core/pageTitle";
import { prisma } from "#core/prisma.server";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { Gender, UserGroup } from "@prisma/client";
import type {
  LoaderArgs,
  SerializeFrom,
  V2_MetaFunction,
} from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import chunk from "lodash.chunk";
import { Suspense } from "react";

export const handle: RouteHandle = {
  htmlBackgroundColor: cn("bg-gray-50 bg-var-gray-50 print:bg-white"),
};

const MAX_ITEM_PER_PAGES = 35;
const MAX_PAGES = 5;
const MAX_ANIMAL_COUNT = MAX_ITEM_PER_PAGES * MAX_PAGES;

export async function loader({ request }: LoaderArgs) {
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

    // Primsa doesn't return a real Promise.
    // See https://github.com/remix-run/remix/issues/5153#issuecomment-1538484918
    animals: Promise.resolve().then(() => animals),
  });
}

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Exports des animaux") }];
};

export default function Route() {
  const { animals, totalCount } = useLoaderData<typeof loader>();

  return (
    <main className="py-1 md:py-2 print:py-0 md:print:py-0 grid grid-cols-1 gap-1 md:gap-2 print:gap-0 md:print:gap-0">
      {totalCount > MAX_ANIMAL_COUNT ? (
        <div className="px-1 md:px-2 grid print:hidden grid-cols-1">
          <BlockHelper variant="warning">
            Pour des raisons de performance, seulement {MAX_ANIMAL_COUNT}{" "}
            animaux sur {totalCount} sont affichés.
          </BlockHelper>
        </div>
      ) : null}

      <div className="px-1 md:px-2 grid print:hidden grid-cols-1 justify-items-end">
        <Action onClick={() => window.print()}>
          <Icon id="print" />
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
  let fallbackSize: ImageSize = "1024";
  if (animals.length >= 31) {
    itemWidth = 136;
  } else if (animals.length >= 25) {
    itemWidth = 145;
  } else if (animals.length >= 21) {
    itemWidth = 163;
  } else if (animals.length >= 16) {
    itemWidth = 197;
  } else if (animals.length >= 13) {
    itemWidth = 199;
  } else if (animals.length >= 10) {
    itemWidth = 254;
    fallbackSize = "512";
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
        "overflow-auto scrollbars-none grid grid-cols-[auto] justify-items-center",
        className,
      )}
    >
      <div className="px-1 md:px-2 print:px-0 md:print:px-0 flex">
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
        "w-[29.6cm] aspect-A4-landscape bg-white bg-var-white p-2 flex flex-wrap content-center justify-center gap-2",
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
  return (
    <li
      {...rest}
      className={cn("flex-none grid grid-cols-1 gap-0.5", className)}
      style={{ width }}
    >
      <DynamicImage
        imageId={animal.avatar}
        alt={animal.name}
        fallbackSize={imageSize}
        sizes={{ default: `${imageSize}px` }}
        className="w-full rounded-1"
      />

      <p className="grid grid-cols-[auto] grid-flow-col auto-cols-fr gap-0.25 text-body-emphasis">
        <span
          className={cn(
            "h-2 flex items-center",
            animal.gender === Gender.FEMALE ? "text-pink-500" : "text-blue-500",
          )}
        >
          <Icon id={GENDER_ICON[animal.gender]} />
        </span>

        <span className="truncate">{animal.name}</span>
      </p>
    </li>
  );
}
