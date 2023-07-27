import { Prisma, UserGroup } from "@prisma/client";
import { LoaderArgs, json } from "@remix-run/node";
import { V2_MetaFunction, useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils";
import { BreedFilterForm } from "~/breeds/filterForm";
import { BreedItem } from "~/breeds/item";
import { BreedSearchParams } from "~/breeds/searchParams";
import { Action } from "~/core/actions";
import { algolia } from "~/core/algolia/algolia.server";
import { BaseLink } from "~/core/baseLink";
import { Paginator } from "~/core/controllers/paginator";
import { SortAndFiltersFloatingAction } from "~/core/controllers/sortAndFiltersFloatingAction";
import { Empty } from "~/core/dataDisplay/empty";
import { prisma } from "~/core/db.server";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import {
  PageSearchParams,
  useOptimisticSearchParams,
} from "~/core/searchParams";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";

const BREED_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = new PageSearchParams(searchParams);
  const breedSearchParams = new BreedSearchParams(searchParams);

  const where: Prisma.BreedWhereInput[] = [];

  const species = breedSearchParams.getSpecies();
  if (species.length > 0) {
    where.push({ species: { in: species } });
  }

  const name = breedSearchParams.getName();
  if (name != null) {
    const breeds = await algolia.breed.search({ name, species });
    where.push({ id: { in: breeds.map((breed) => breed.id) } });
  }

  const sort = breedSearchParams.getSort();

  const { breeds, totalCount } = await promiseHash({
    totalCount: prisma.breed.count({ where: { AND: where } }),

    breeds: prisma.breed.findMany({
      skip: pageSearchParams.getPage() * BREED_COUNT_PER_PAGE,
      take: BREED_COUNT_PER_PAGE,
      orderBy: BREED_ORDER_BY[sort],
      where: { AND: where },
      select: {
        id: true,
        name: true,
        species: true,
        _count: {
          select: {
            animals: true,
          },
        },
      },
    }),
  });

  const pageCount = Math.ceil(totalCount / BREED_COUNT_PER_PAGE);

  return json({ totalCount, pageCount, breeds });
}

const BREED_ORDER_BY: Record<
  (typeof BreedSearchParams.Sort)[keyof typeof BreedSearchParams.Sort],
  Prisma.BreedFindManyArgs["orderBy"]
> = {
  [BreedSearchParams.Sort.NAME]: { name: "asc" },
  [BreedSearchParams.Sort.ANIMAL_COUNT]: { animals: { _count: "desc" } },
};

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Races") }];
};

export default function Route() {
  const { totalCount, pageCount, breeds } = useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();
  const breedSearchParams = new BreedSearchParams(searchParams);

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col gap-1 md:flex-row md:gap-2">
        <section className="md:min-w-0 md:flex-2 flex flex-col">
          <Card>
            <Card.Header>
              <Card.Title>
                {totalCount} {totalCount > 1 ? "races" : "race"}
              </Card.Title>

              <Action asChild variant="text">
                <BaseLink to="./new">Créer</BaseLink>
              </Action>
            </Card.Header>

            <Card.Content>
              {breeds.length > 0 ? (
                <ul className="grid grid-cols-1">
                  {breeds.map((breed) => (
                    <li key={breed.id} className="flex">
                      <BreedItem breed={breed} className="w-full" />
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty
                  isCompact
                  icon="🧬"
                  iconAlt="ADN"
                  title="Aucune race trouvée"
                  message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
                  titleElementType="h3"
                  action={
                    !breedSearchParams.isEmpty() ? (
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
              <Card.Title>Trier et filtrer</Card.Title>
            </Card.Header>

            <Card.Content hasVerticalScroll>
              <BreedFilterForm />
            </Card.Content>
          </Card>
        </aside>

        <SortAndFiltersFloatingAction hasSort totalCount={totalCount}>
          <BreedFilterForm />
        </SortAndFiltersFloatingAction>
      </PageLayout.Content>
    </PageLayout>
  );
}
