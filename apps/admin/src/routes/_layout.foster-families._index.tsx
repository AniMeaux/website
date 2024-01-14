import { AnimalAvatar } from "#animals/avatar";
import { Action } from "#core/actions.tsx";
import { algolia } from "#core/algolia/algolia.server.ts";
import { BaseLink } from "#core/baseLink.tsx";
import { Paginator } from "#core/controllers/paginator.tsx";
import { SortAndFiltersFloatingAction } from "#core/controllers/sortAndFiltersFloatingAction.tsx";
import { Avatar } from "#core/dataDisplay/avatar";
import { Empty } from "#core/dataDisplay/empty.tsx";
import { db } from "#core/db.server.ts";
import { Card } from "#core/layout/card.tsx";
import { PageLayout } from "#core/layout/page.tsx";
import { Routes } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { prisma } from "#core/prisma.server.ts";
import { PageSearchParams } from "#core/searchParams.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { FosterFamilyAvatar } from "#fosterFamilies/avatar";
import { FosterFamilyFilters } from "#fosterFamilies/filterForm.tsx";
import { getShortLocation } from "#fosterFamilies/location";
import { FosterFamilySearchParams } from "#fosterFamilies/searchParams.ts";
import { cn } from "@animeaux/core";
import { useOptimisticSearchParams } from "@animeaux/form-data";
import type { Prisma } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils";

const FOSTER_FAMILY_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = PageSearchParams.parse(searchParams);
  const fosterFamilySearchParams = FosterFamilySearchParams.parse(searchParams);

  const where: Prisma.FosterFamilyWhereInput[] = [];
  if (fosterFamilySearchParams.zipCode != null) {
    where.push({ zipCode: { startsWith: fosterFamilySearchParams.zipCode } });
  }

  if (fosterFamilySearchParams.cities.size > 0) {
    where.push({
      city: {
        in: Array.from(fosterFamilySearchParams.cities),
        mode: "insensitive",
      },
    });
  }

  if (fosterFamilySearchParams.displayName != null) {
    const fosterFamilies = await algolia.fosterFamily.findMany({
      where: { displayName: fosterFamilySearchParams.displayName },
    });

    where.push({
      id: { in: fosterFamilies.map((fosterFamily) => fosterFamily.id) },
    });
  }

  if (fosterFamilySearchParams.speciesToHost != null) {
    where.push({
      speciesToHost: { has: fosterFamilySearchParams.speciesToHost },
    });
  }

  fosterFamilySearchParams.speciesAlreadyPresent.forEach((species) => {
    where.push({
      OR: [
        { speciesAlreadyPresent: { has: species } },
        { fosterAnimals: { some: { species } } },
      ],
    });
  });

  if (fosterFamilySearchParams.speciesToAvoid.size > 0) {
    where.push({
      NOT: {
        speciesAlreadyPresent: {
          hasSome: Array.from(fosterFamilySearchParams.speciesToAvoid),
        },
      },
      fosterAnimals: {
        none: {
          species: { in: Array.from(fosterFamilySearchParams.speciesToAvoid) },
        },
      },
    });
  }

  const { possibleCities, totalCount, fosterFamilies } = await promiseHash({
    possibleCities: prisma.fosterFamily.groupBy({
      by: ["city"],
      _count: { city: true },
      orderBy: { city: "asc" },
    }),

    totalCount: prisma.fosterFamily.count({ where: { AND: where } }),

    fosterFamilies: prisma.fosterFamily.findMany({
      skip: pageSearchParams.page * FOSTER_FAMILY_COUNT_PER_PAGE,
      take: FOSTER_FAMILY_COUNT_PER_PAGE,
      orderBy: { displayName: "asc" },
      where: { AND: where },
      select: {
        availability: true,
        city: true,
        displayName: true,
        fosterAnimals: { select: { avatar: true, name: true, id: true } },
        id: true,
        zipCode: true,
      },
    }),
  });

  const pageCount = Math.ceil(totalCount / FOSTER_FAMILY_COUNT_PER_PAGE);

  return json({
    totalCount,
    pageCount,
    fosterFamilies,
    possibleCities: possibleCities.map((group) => group.city),
  });
}

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Familles d’accueil") }];
};

export default function Route() {
  const { totalCount, pageCount, fosterFamilies, possibleCities } =
    useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        <section className="flex flex-col gap-1 md:flex-row md:gap-2">
          <section className="flex flex-col md:min-w-0 md:flex-2">
            <Card>
              <Card.Header>
                <Card.Title>
                  {totalCount}{" "}
                  {totalCount > 1 ? "familles d’accueil" : "famille d’accueil"}
                </Card.Title>

                <Action asChild variant="text">
                  <BaseLink to={Routes.fosterFamilies.new.toString()}>
                    Créer
                  </BaseLink>
                </Action>
              </Card.Header>

              <Card.Content hasNewItems>
                {fosterFamilies.length > 0 ? (
                  <ul className="grid grid-cols-1">
                    {fosterFamilies.map((fosterFamily) => (
                      <li key={fosterFamily.id} className="flex">
                        <FosterFamilyItem
                          fosterFamily={fosterFamily}
                          className="w-full"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Empty
                    isCompact
                    icon="🏡"
                    iconAlt="Maison avec jardin"
                    title="Aucune famille d’accueil trouvée"
                    message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
                    titleElementType="h3"
                    action={
                      !FosterFamilySearchParams.isEmpty(searchParams) ? (
                        <Action asChild>
                          <BaseLink to={{ search: "" }}>
                            Effacer les filtres
                          </BaseLink>
                        </Action>
                      ) : null
                    }
                  />
                )}
              </Card.Content>

              {pageCount > 1 ? (
                <Card.Footer>
                  <Paginator pageCount={pageCount} />
                </Card.Footer>
              ) : null}
            </Card>
          </section>

          <aside className="hidden flex-col min-w-[250px] max-w-[300px] flex-1 md:flex">
            <Card className="sticky top-8 max-h-[calc(100vh-100px)]">
              <Card.Header>
                <Card.Title>Filtrer</Card.Title>
              </Card.Header>

              <Card.Content hasVerticalScroll>
                <FosterFamilyFilters possibleCities={possibleCities} />
              </Card.Content>
            </Card>
          </aside>
        </section>

        <SortAndFiltersFloatingAction totalCount={totalCount}>
          <FosterFamilyFilters possibleCities={possibleCities} />
        </SortAndFiltersFloatingAction>
      </PageLayout.Content>
    </PageLayout>
  );
}

function FosterFamilyItem({
  fosterFamily,
  className,
}: {
  fosterFamily: SerializeFrom<typeof loader>["fosterFamilies"][number];
  className?: string;
}) {
  const fosterAnimalsAvatars = fosterFamily.fosterAnimals.map((animal) => (
    <AnimalAvatar
      key={animal.id}
      size="sm"
      animal={animal}
      className={ANIMAL_AVATAR_CLASS_NAME}
    />
  ));

  if (fosterAnimalsAvatars.length > MAX_ANIMAL_AVATAR_COUNT) {
    const restCount =
      fosterAnimalsAvatars.length - (MAX_ANIMAL_AVATAR_COUNT - 1);

    fosterAnimalsAvatars.splice(
      MAX_ANIMAL_AVATAR_COUNT - 1,
      restCount,
      <Avatar
        key="ellipsis"
        color="gray-light"
        size="sm"
        className={ANIMAL_AVATAR_CLASS_NAME}
      >
        <span className="text-caption-emphasis">+{restCount}</span>
      </Avatar>,
    );
  }

  return (
    <BaseLink
      to={Routes.fosterFamilies.id(fosterFamily.id).toString()}
      className={cn(
        className,
        "rounded-0.5 px-0.5 md:px-1 py-1 grid grid-cols-[auto_minmax(0px,1fr)] grid-flow-col items-start gap-1 md:gap-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 bg-white bg-var-white hover:bg-gray-100 hover:bg-var-gray-100 focus-visible:z-10",
      )}
    >
      <FosterFamilyAvatar size="sm" availability={fosterFamily.availability} />

      <span className="flex flex-col md:flex-row md:gap-2">
        <span className="text-body-emphasis">{fosterFamily.displayName}</span>
        <span className="text-gray-500">{getShortLocation(fosterFamily)}</span>
      </span>

      {fosterAnimalsAvatars.length > 0 ? (
        <span className="flex self-center">{fosterAnimalsAvatars}</span>
      ) : null}
    </BaseLink>
  );
}

const MAX_ANIMAL_AVATAR_COUNT = 5;

const ANIMAL_AVATAR_CLASS_NAME = cn(
  "flex-none ring-2 ring-inheritBg -ml-0.5 first:ml-0",
);
