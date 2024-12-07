import { AnimalFilters } from "#animals/filter-form";
import { AnimalItem } from "#animals/item";
import {
  AnimalSearchParams,
  AnimalSort,
  AnimalSortSearchParams,
} from "#animals/search-params";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Paginator } from "#core/controllers/paginator";
import { SortAndFiltersFloatingAction } from "#core/controllers/sort-and-filters-floating-action";
import { Empty } from "#core/data-display/empty";
import { db } from "#core/db.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import { ForbiddenResponse } from "#core/response.server";
import { PageSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { hasGroups } from "#users/groups";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import invariant from "tiny-invariant";

// Multiple of 6, 5, 4 and 3 to be nicely displayed.
const ANIMAL_COUNT_PER_PAGE = 60;

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
    UserGroup.VOLUNTEER,
  ]);

  const showFosterFamilies = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const isCurrentUserAnimalAdmin = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
  ]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = PageSearchParams.parse(searchParams);
  const animalSortSearchParams = AnimalSortSearchParams.parse(searchParams);
  const animalSearchParams = AnimalSearchParams.parse(searchParams);

  if (
    !isCurrentUserAnimalAdmin &&
    (animalSortSearchParams.sort === AnimalSort.VACCINATION ||
      animalSearchParams.sterilizations.size > 0 ||
      animalSearchParams.vaccinations.size > 0 ||
      animalSearchParams.nextVaccinationDateStart != null ||
      animalSearchParams.nextVaccinationDateEnd != null ||
      animalSearchParams.diagnosis.size > 0)
  ) {
    throw new ForbiddenResponse();
  }

  if (!showFosterFamilies && animalSearchParams.fosterFamiliesId.size > 0) {
    throw new ForbiddenResponse();
  }

  const { where, orderBy } = await db.animal.createFindManyParams(
    animalSearchParams,
    animalSortSearchParams.sort,
  );

  const {
    managers,
    fosterFamilies,
    possiblePickUpLocations,
    totalCount,
    animals,
  } = await promiseHash({
    managers: prisma.user.findMany({
      where: {
        isDisabled: false,
        groups: { has: UserGroup.ANIMAL_MANAGER },
      },
      select: { id: true, displayName: true },
      orderBy: { displayName: "asc" },
    }),

    fosterFamilies: showFosterFamilies
      ? prisma.fosterFamily.findMany({
          where: {
            fosterAnimals: {
              // There is at least one foster animal.
              // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#some
              some: {},
            },
          },
          select: {
            availability: true,
            displayName: true,
            id: true,
          },
          orderBy: { displayName: "asc" },
        })
      : Promise.resolve(null),

    possiblePickUpLocations: prisma.animal.groupBy({
      by: ["pickUpLocation"],
      where: { pickUpLocation: { not: null } },
      _count: { pickUpLocation: true },
      orderBy: { pickUpLocation: "asc" },
    }),

    totalCount: prisma.animal.count({ where }),

    animals: prisma.animal.findMany({
      skip: pageSearchParams.page * ANIMAL_COUNT_PER_PAGE,
      take: ANIMAL_COUNT_PER_PAGE,
      orderBy,
      where,
      select: {
        alias: true,
        avatar: true,
        birthdate: true,
        gender: true,
        id: true,
        manager: { select: { displayName: true } },
        name: true,
        species: true,
        status: true,

        ...(isCurrentUserAnimalAdmin
          ? {
              isSterilizationMandatory: true,
              isSterilized: true,
              nextVaccinationDate: true,
            }
          : {}),
      },
    }),
  });

  const pageCount = Math.ceil(totalCount / ANIMAL_COUNT_PER_PAGE);

  const canCreate = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const canExport = hasGroups(currentUser, [UserGroup.ADMIN]);

  return json({
    totalCount,
    pageCount,
    animals,
    managers,
    fosterFamilies,
    possiblePickUpLocations: possiblePickUpLocations.map((group) => {
      invariant(group.pickUpLocation != null, "pickUpLocation should exists");
      return group.pickUpLocation;
    }),
    currentUser,
    canCreate,
    canExport,
  });
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Tous les animaux") }];
};

export default function Route() {
  const { totalCount, pageCount, animals, canCreate, canExport } =
    useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:flex-row md:gap-2">
        <section className="flex flex-col md:min-w-0 md:flex-2">
          <Card>
            <Card.Header>
              <Card.Title>
                {totalCount} {totalCount > 1 ? "animaux" : "animal"}
              </Card.Title>

              {canExport ? (
                <Action asChild variant="text" color="gray">
                  <BaseLink
                    to={{
                      pathname: Routes.downloads.animals.toString(),
                      search: searchParams.toString(),
                    }}
                  >
                    <Action.Icon href="icon-print" />
                    Imprimer
                  </BaseLink>
                </Action>
              ) : null}

              {canCreate ? (
                <Action asChild variant="text">
                  <BaseLink to={Routes.animals.new.profile.toString()}>
                    Créer
                  </BaseLink>
                </Action>
              ) : null}
            </Card.Header>

            <Card.Content hasListItems>
              {animals.length > 0 ? (
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] items-start md:grid-cols-[repeat(auto-fill,minmax(170px,1fr))]">
                  {animals.map((animal, index) => (
                    <li key={animal.id} className="flex">
                      <AnimalItem
                        animal={animal}
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
                  icon="🪹"
                  iconAlt="Nid vide"
                  title="Aucun animal trouvé"
                  message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
                  titleElementType="h3"
                  action={
                    !AnimalSearchParams.isEmpty(searchParams) ? (
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

        <aside className="hidden min-w-[250px] max-w-[300px] flex-1 flex-col md:flex">
          <Card className="sticky top-[calc(20px+var(--header-height))] max-h-[calc(100vh-40px-var(--header-height))]">
            <Card.Header>
              <Card.Title>Trier et filtrer</Card.Title>
            </Card.Header>

            <Card.Content hasVerticalScroll>
              <SortAndFilters />
            </Card.Content>
          </Card>
        </aside>

        <SortAndFiltersFloatingAction hasSort totalCount={totalCount}>
          <SortAndFilters />
        </SortAndFiltersFloatingAction>
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

function SortAndFilters() {
  const { currentUser, managers, fosterFamilies, possiblePickUpLocations } =
    useLoaderData<typeof loader>();

  return (
    <AnimalFilters
      currentUser={currentUser}
      managers={managers}
      fosterFamilies={fosterFamilies ?? []}
      possiblePickUpLocations={possiblePickUpLocations}
    />
  );
}
