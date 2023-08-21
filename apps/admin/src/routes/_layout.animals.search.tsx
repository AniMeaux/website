import { ANIMAL_AGE_RANGE_BY_SPECIES } from "@animeaux/shared";
import { Prisma, Status, UserGroup } from "@prisma/client";
import { LoaderArgs, json } from "@remix-run/node";
import { V2_MetaFunction, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { promiseHash } from "remix-utils";
import invariant from "tiny-invariant";
import { AnimalFilters } from "~/animals/filterForm";
import { AnimalItem } from "~/animals/item";
import {
  AnimalSearchParams,
  AnimalSort,
  AnimalSterilization,
} from "~/animals/searchParams";
import { SORTED_SPECIES } from "~/animals/species";
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
import { ForbiddenResponse } from "~/core/response.server";
import {
  PageSearchParams,
  useOptimisticSearchParams,
} from "~/core/searchParams";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { hasGroups } from "~/users/groups";

// Multiple of 6, 5, 4 and 3 to be nicely displayed.
const ANIMAL_COUNT_PER_PAGE = 60;

export async function loader({ request }: LoaderArgs) {
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
  const animalSearchParams = AnimalSearchParams.parse(searchParams);

  if (
    !isCurrentUserAnimalAdmin &&
    animalSearchParams.sort === AnimalSort.VACCINATION
  ) {
    throw new ForbiddenResponse();
  }

  const where: Prisma.AnimalWhereInput[] = [];
  if (animalSearchParams.species.size > 0) {
    where.push({ species: { in: Array.from(animalSearchParams.species) } });
  }

  if (animalSearchParams.ages.size > 0) {
    const now = DateTime.now();

    const conditions: Prisma.AnimalWhereInput[] = [];
    SORTED_SPECIES.forEach((species) => {
      animalSearchParams.ages.forEach((age) => {
        const ageRange = ANIMAL_AGE_RANGE_BY_SPECIES[species]?.[age];
        if (ageRange != null) {
          conditions.push({
            species,
            birthdate: {
              gt: now.minus({ months: ageRange.maxMonths }).toJSDate(),
              lte: now.minus({ months: ageRange.minMonths }).toJSDate(),
            },
          });
        }
      });
    });

    where.push({ OR: conditions });
  }

  if (
    animalSearchParams.birthdateStart != null ||
    animalSearchParams.birthdateEnd != null
  ) {
    const birthdate: Prisma.DateTimeFilter = {};

    if (animalSearchParams.birthdateStart != null) {
      birthdate.gte = animalSearchParams.birthdateStart;
    }

    if (animalSearchParams.birthdateEnd != null) {
      birthdate.lte = animalSearchParams.birthdateEnd;
    }

    where.push({ birthdate });
  }

  if (animalSearchParams.statuses.size > 0) {
    where.push({ status: { in: Array.from(animalSearchParams.statuses) } });
  }

  if (animalSearchParams.managersId.size > 0) {
    where.push({
      managerId: { in: Array.from(animalSearchParams.managersId) },
    });
  }

  if (showFosterFamilies) {
    if (animalSearchParams.fosterFamiliesId.size > 0) {
      where.push({
        fosterFamilyId: { in: Array.from(animalSearchParams.fosterFamiliesId) },
      });
    }
  }

  if (
    animalSearchParams.pickUpDateStart != null ||
    animalSearchParams.pickUpDateEnd != null
  ) {
    const pickUpDate: Prisma.DateTimeFilter = {};

    if (animalSearchParams.pickUpDateStart != null) {
      pickUpDate.gte = animalSearchParams.pickUpDateStart;
    }

    if (animalSearchParams.pickUpDateEnd != null) {
      pickUpDate.lte = animalSearchParams.pickUpDateEnd;
    }

    where.push({ pickUpDate });
  }

  if (animalSearchParams.pickUpLocations.size > 0) {
    where.push({
      pickUpLocation: {
        in: Array.from(animalSearchParams.pickUpLocations),
        mode: "insensitive",
      },
    });
  }

  if (animalSearchParams.pickUpReasons.size > 0) {
    where.push({
      pickUpReason: { in: Array.from(animalSearchParams.pickUpReasons) },
    });
  }

  if (animalSearchParams.nameOrAlias != null) {
    const animals = await algolia.animal.search({
      nameOrAlias: animalSearchParams.nameOrAlias,
      pickUpDateEnd: animalSearchParams.pickUpDateEnd,
      pickUpDateStart: animalSearchParams.pickUpDateStart,
      pickUpLocations: animalSearchParams.pickUpLocations,
      species: animalSearchParams.species,
      statuses: animalSearchParams.statuses,
    });

    where.push({ id: { in: animals.map((animal) => animal.id) } });
  }

  if (animalSearchParams.adoptionOptions.size > 0) {
    where.push({
      status: { in: [Status.ADOPTED] },
      adoptionOption: {
        in: Array.from(animalSearchParams.adoptionOptions),
      },
    });
  }

  if (
    animalSearchParams.adoptionDateStart != null ||
    animalSearchParams.adoptionDateEnd != null
  ) {
    const adoptionDate: Prisma.DateTimeFilter = {};

    if (animalSearchParams.adoptionDateStart != null) {
      adoptionDate.gte = animalSearchParams.adoptionDateStart;
    }

    if (animalSearchParams.adoptionDateEnd != null) {
      adoptionDate.lte = animalSearchParams.adoptionDateEnd;
    }

    where.push({
      status: { in: [Status.ADOPTED] },
      adoptionDate,
    });
  }

  if (animalSearchParams.fivResults.size > 0) {
    where.push({
      screeningFiv: { in: Array.from(animalSearchParams.fivResults) },
    });
  }

  if (animalSearchParams.felvResults.size > 0) {
    where.push({
      screeningFelv: { in: Array.from(animalSearchParams.felvResults) },
    });
  }

  if (isCurrentUserAnimalAdmin) {
    if (animalSearchParams.sterilizations.size > 0) {
      const conditions: Prisma.AnimalWhereInput[] = [];

      if (animalSearchParams.sterilizations.has(AnimalSterilization.YES)) {
        conditions.push({ isSterilized: true, isSterilizationMandatory: true });
      }

      if (animalSearchParams.sterilizations.has(AnimalSterilization.NO)) {
        conditions.push({
          isSterilized: false,
          isSterilizationMandatory: true,
        });
      }

      if (
        animalSearchParams.sterilizations.has(AnimalSterilization.NOT_MANDATORY)
      ) {
        conditions.push({
          isSterilized: false,
          isSterilizationMandatory: false,
        });
      }

      where.push({ OR: conditions });
    }

    if (animalSearchParams.noVaccination) {
      where.push({ nextVaccinationDate: null });
    }

    if (
      animalSearchParams.nextVaccinationDateStart != null ||
      animalSearchParams.nextVaccinationDateEnd != null
    ) {
      const nextVaccinationDate: Prisma.DateTimeFilter = {};

      if (animalSearchParams.nextVaccinationDateStart != null) {
        nextVaccinationDate.gte = animalSearchParams.nextVaccinationDateStart;
      }

      if (animalSearchParams.nextVaccinationDateEnd != null) {
        nextVaccinationDate.lte = animalSearchParams.nextVaccinationDateEnd;
      }

      where.push({ nextVaccinationDate });
    }
  }

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
          select: { id: true, displayName: true },
          orderBy: { displayName: "asc" },
        })
      : Promise.resolve([]),

    possiblePickUpLocations: prisma.animal.groupBy({
      by: ["pickUpLocation"],
      where: { pickUpLocation: { not: null } },
      _count: { pickUpLocation: true },
      orderBy: { pickUpLocation: "asc" },
    }),

    totalCount: prisma.animal.count({ where: { AND: where } }),

    animals: prisma.animal.findMany({
      skip: pageSearchParams.page * ANIMAL_COUNT_PER_PAGE,
      take: ANIMAL_COUNT_PER_PAGE,
      orderBy: ANIMAL_ORDER_BY[animalSearchParams.sort],
      where: { AND: where },
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
  });
}

const ANIMAL_ORDER_BY: Record<
  AnimalSort,
  Prisma.AnimalFindManyArgs["orderBy"]
> = {
  [AnimalSort.BIRTHDATE]: { birthdate: "desc" },
  [AnimalSort.NAME]: { name: "asc" },
  [AnimalSort.PICK_UP]: { pickUpDate: "desc" },
  [AnimalSort.VACCINATION]: { nextVaccinationDate: "asc" },
};

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Tous les animaux") }];
};

export default function Route() {
  const { totalCount, pageCount, animals, canCreate } =
    useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();

  return (
    <PageLayout.Content className="flex flex-col gap-1 md:flex-row md:gap-2">
      <section className="flex flex-col md:min-w-0 md:flex-2">
        <Card>
          <Card.Header>
            <Card.Title>
              {totalCount} {totalCount > 1 ? "animaux" : "animal"}
            </Card.Title>

            {canCreate ? (
              <Action asChild variant="text">
                <BaseLink to={Routes.animals.new.profile.toString()}>
                  Créer
                </BaseLink>
              </Action>
            ) : null}
          </Card.Header>

          <Card.Content>
            {animals.length > 0 ? (
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1 md:gap-2">
                {animals.map((animal, index) => (
                  <li key={animal.id} className="flex">
                    <AnimalItem
                      animal={animal}
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

      <aside className="hidden flex-col min-w-[250px] max-w-[300px] flex-1 md:flex">
        <Card className="sticky top-[var(--header-height)] max-h-[calc(100vh-20px-var(--header-height))]">
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
  );
}

function SortAndFilters() {
  const { currentUser, managers, fosterFamilies, possiblePickUpLocations } =
    useLoaderData<typeof loader>();

  return (
    <AnimalFilters
      currentUser={currentUser}
      managers={managers}
      fosterFamilies={fosterFamilies}
      possiblePickUpLocations={possiblePickUpLocations}
    />
  );
}
