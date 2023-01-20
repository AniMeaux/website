import { FosterFamily, Prisma, UserGroup } from "@prisma/client";
import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import orderBy from "lodash.orderby";
import { promiseHash } from "remix-utils";
import { actionClassName } from "~/core/actions";
import { algolia } from "~/core/algolia/algolia.server";
import { BaseLink } from "~/core/baseLink";
import { Paginator } from "~/core/controllers/paginator";
import { SortAndFiltersFloatingAction } from "~/core/controllers/sortAndFiltersFloatingAction";
import { Empty } from "~/core/dataDisplay/empty";
import { prisma } from "~/core/db.server";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/core/layout/card";
import { PageContent, PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import {
  PageSearchParams,
  useOptimisticSearchParams,
} from "~/core/searchParams";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { FosterFamilyFilters } from "~/fosterFamilies/filterForm";
import { ForsterFamilyItem } from "~/fosterFamilies/item";
import { FosterFamilySearchParams } from "~/fosterFamilies/searchParams";

const FOSTER_FAMILY_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = new PageSearchParams(searchParams);
  const fosterFamilySearchParams = new FosterFamilySearchParams(searchParams);

  const where: Prisma.FosterFamilyWhereInput[] = [];
  const zipCode = fosterFamilySearchParams.getZipCode();
  if (zipCode != null) {
    where.push({ zipCode: { startsWith: zipCode } });
  }

  const cities = fosterFamilySearchParams.getCities();
  if (cities.length > 0) {
    where.push({ city: { in: cities, mode: "insensitive" } });
  }

  const displayName = fosterFamilySearchParams.getDisplayName();
  let rankedFosterFamiliesId: FosterFamily["id"][] = [];
  if (displayName != null) {
    const fosterFamilies = await algolia.fosterFamily.search({ displayName });

    rankedFosterFamiliesId = fosterFamilies.map(
      (fosterFamily) => fosterFamily.id
    );

    where.push({ id: { in: rankedFosterFamiliesId } });
  }

  const speciesToHost = fosterFamilySearchParams.getSpeciesToHost();
  if (speciesToHost != null) {
    where.push({ speciesToHost: { has: speciesToHost } });
  }

  const speciesAlreadyPresent =
    fosterFamilySearchParams.getSpeciesAlreadyPresent();
  if (speciesAlreadyPresent.length > 0) {
    speciesAlreadyPresent.forEach((species) => {
      where.push({
        OR: [
          { speciesAlreadyPresent: { has: species } },
          { fosterAnimals: { some: { species } } },
        ],
      });
    });
  }

  const speciesToAvoid = fosterFamilySearchParams.getSpeciesToAvoid();
  if (speciesToAvoid.length > 0) {
    where.push({
      NOT: { speciesAlreadyPresent: { hasSome: speciesToAvoid } },
      fosterAnimals: { none: { species: { in: speciesToAvoid } } },
    });
  }

  const sort = fosterFamilySearchParams.getSort();

  let { possibleCities, totalCount, fosterFamilies } = await promiseHash({
    possibleCities: prisma.fosterFamily.groupBy({
      by: ["city"],
      _count: { city: true },
      orderBy: { city: "asc" },
    }),

    totalCount: prisma.fosterFamily.count({ where: { AND: where } }),

    fosterFamilies: prisma.fosterFamily.findMany({
      skip: pageSearchParams.getPage() * FOSTER_FAMILY_COUNT_PER_PAGE,
      take: FOSTER_FAMILY_COUNT_PER_PAGE,
      orderBy:
        sort === FosterFamilySearchParams.Sort.NAME || displayName == null
          ? { displayName: "asc" }
          : undefined,
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

  if (
    sort === FosterFamilySearchParams.Sort.RELEVANCE &&
    rankedFosterFamiliesId.length > 0
  ) {
    fosterFamilies = orderBy(fosterFamilies, (fosterFamily) =>
      rankedFosterFamiliesId.findIndex(
        (fosterFamilyId) => fosterFamily.id === fosterFamilyId
      )
    );
  }

  const pageCount = Math.ceil(totalCount / FOSTER_FAMILY_COUNT_PER_PAGE);

  return json({
    totalCount,
    pageCount,
    fosterFamilies,
    possibleCities: possibleCities.map((group) => group.city),
  });
}

export const meta: MetaFunction = () => {
  return { title: getPageTitle("Familles d’accueil") };
};

export default function FosterFamiliesPage() {
  const { totalCount, pageCount, fosterFamilies } =
    useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();
  const fosterFamilySearchParams = new FosterFamilySearchParams(searchParams);

  return (
    <PageLayout>
      <PageContent className="flex flex-col gap-1 md:gap-2">
        <section className="flex flex-col gap-1 md:flex-row md:gap-2">
          <section className="flex flex-col md:min-w-0 md:flex-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {totalCount}{" "}
                  {totalCount > 1 ? "familles d’accueil" : "famille d’accueil"}
                </CardTitle>

                <BaseLink
                  to="./new"
                  className={actionClassName.standalone({ variant: "text" })}
                >
                  Créer
                </BaseLink>
              </CardHeader>

              <CardContent>
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
                    icon="🏡"
                    iconAlt="Maison avec jardin"
                    title="Aucune famille d’accueil trouvée"
                    message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
                    titleElementType="h3"
                    action={
                      !fosterFamilySearchParams.isEmpty() ? (
                        <BaseLink
                          to={{ search: "" }}
                          className={actionClassName.standalone()}
                        >
                          Effacer les filtres
                        </BaseLink>
                      ) : null
                    }
                  />
                )}
              </CardContent>

              {pageCount > 1 ? (
                <CardFooter>
                  <Paginator pageCount={pageCount} />
                </CardFooter>
              ) : null}
            </Card>
          </section>

          <aside className="hidden flex-col min-w-[250px] max-w-[300px] flex-1 md:flex">
            <Card className="sticky top-8 max-h-[calc(100vh-100px)]">
              <CardHeader>
                <CardTitle>Trier et filtrer</CardTitle>
              </CardHeader>

              <CardContent hasVerticalScroll>
                <SortAndFilters />
              </CardContent>
            </Card>
          </aside>
        </section>

        <SortAndFiltersFloatingAction totalCount={totalCount}>
          <SortAndFilters />
        </SortAndFiltersFloatingAction>
      </PageContent>
    </PageLayout>
  );
}

function SortAndFilters() {
  const { possibleCities } = useLoaderData<typeof loader>();
  return <FosterFamilyFilters possibleCities={possibleCities} />;
}
