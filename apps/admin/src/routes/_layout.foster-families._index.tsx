import { Prisma, UserGroup } from "@prisma/client";
import { LoaderArgs, json } from "@remix-run/node";
import { V2_MetaFunction, useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils";
import { Action } from "~/core/actions";
import { algolia } from "~/core/algolia/algolia.server";
import { BaseLink } from "~/core/baseLink";
import { Paginator } from "~/core/controllers/paginator";
import { SortAndFiltersFloatingAction } from "~/core/controllers/sortAndFiltersFloatingAction";
import { Empty } from "~/core/dataDisplay/empty";
import { db } from "~/core/db.server";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { Routes } from "~/core/navigation";
import { getPageTitle } from "~/core/pageTitle";
import { prisma } from "~/core/prisma.server";
import {
  PageSearchParams,
  useOptimisticSearchParams,
} from "~/core/searchParams";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { FosterFamilyFilters } from "~/fosterFamilies/filterForm";
import { ForsterFamilyItem } from "~/fosterFamilies/item";
import { FosterFamilySearchParams } from "~/fosterFamilies/searchParams";

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
    const fosterFamilies = await algolia.fosterFamily.search({
      displayName: fosterFamilySearchParams.displayName,
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
        city: true,
        displayName: true,
        id: true,
        speciesToHost: true,
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
  const { totalCount, pageCount, fosterFamilies } =
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

              <Card.Content>
                {fosterFamilies.length > 0 ? (
                  <ul className="grid grid-cols-1">
                    {fosterFamilies.map((fosterFamily) => (
                      <li key={fosterFamily.id} className="flex">
                        <ForsterFamilyItem
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
                <SortAndFilters />
              </Card.Content>
            </Card>
          </aside>
        </section>

        <SortAndFiltersFloatingAction totalCount={totalCount}>
          <SortAndFilters />
        </SortAndFiltersFloatingAction>
      </PageLayout.Content>
    </PageLayout>
  );
}

function SortAndFilters() {
  const { possibleCities } = useLoaderData<typeof loader>();
  return <FosterFamilyFilters possibleCities={possibleCities} />;
}
