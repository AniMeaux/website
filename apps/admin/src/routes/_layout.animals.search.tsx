import { ANIMAL_AGE_RANGE_BY_SPECIES } from "@animeaux/shared";
import { Prisma, Status, UserGroup } from "@prisma/client";
import { LoaderArgs, json } from "@remix-run/node";
import { V2_MetaFunction, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { promiseHash } from "remix-utils";
import invariant from "tiny-invariant";
import { AnimalFilters } from "~/animals/filterForm";
import { AnimalItem } from "~/animals/item";
import { AnimalSearchParams } from "~/animals/searchParams";
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
  const pageSearchParams = new PageSearchParams(searchParams);
  const animalSearchParams = new AnimalSearchParams(searchParams);

  const sort = animalSearchParams.getSort();
  if (
    !isCurrentUserAnimalAdmin &&
    sort === AnimalSearchParams.Sort.VACCINATION
  ) {
    throw new ForbiddenResponse();
  }

  const where: Prisma.AnimalWhereInput[] = [];
  const species = animalSearchParams.getSpecies();
  if (species.length > 0) {
    where.push({ species: { in: species } });
  }

  const ages = animalSearchParams.getAges();
  if (ages.length > 0) {
    const now = DateTime.now();

    const conditions: Prisma.AnimalWhereInput[] = [];
    SORTED_SPECIES.forEach((species) => {
      ages.forEach((age) => {
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

  const minBirthdate = animalSearchParams.getMinBirthdate();
  const maxBirthdate = animalSearchParams.getMaxBirthdate();
  if (minBirthdate != null || maxBirthdate != null) {
    const birthdate: Prisma.DateTimeFilter = {};

    if (minBirthdate != null) {
      birthdate.gte = minBirthdate;
    }

    if (maxBirthdate != null) {
      birthdate.lte = maxBirthdate;
    }

    where.push({ birthdate });
  }

  const statuses = animalSearchParams.getStatuses();
  if (statuses.length > 0) {
    where.push({ status: { in: statuses } });
  }

  const managersId = animalSearchParams.getManagersId();
  if (managersId.length > 0) {
    where.push({ managerId: { in: managersId } });
  }

  if (showFosterFamilies) {
    const fosterFamiliesId = animalSearchParams.getFosterFamiliesId();
    if (fosterFamiliesId.length > 0) {
      where.push({ fosterFamilyId: { in: fosterFamiliesId } });
    }
  }

  const minPickUpDate = animalSearchParams.getMinPickUpDate();
  const maxPickUpDate = animalSearchParams.getMaxPickUpDate();
  if (minPickUpDate != null || maxPickUpDate != null) {
    const pickUpDate: Prisma.DateTimeFilter = {};

    if (minPickUpDate != null) {
      pickUpDate.gte = minPickUpDate;
    }

    if (maxPickUpDate != null) {
      pickUpDate.lte = maxPickUpDate;
    }

    where.push({ pickUpDate });
  }

  const pickUpLocations = animalSearchParams.getPickUpLocations();
  if (pickUpLocations.length > 0) {
    where.push({
      pickUpLocation: { in: pickUpLocations, mode: "insensitive" },
    });
  }

  const pickUpReasons = animalSearchParams.getPickUpReasons();
  if (pickUpReasons.length > 0) {
    where.push({ pickUpReason: { in: pickUpReasons } });
  }

  const nameOrAlias = animalSearchParams.getNameOrAlias();
  if (nameOrAlias != null) {
    const animals = await algolia.animal.search({
      nameOrAlias,
      maxPickUpDate,
      minPickUpDate,
      pickUpLocation: pickUpLocations,
      species,
      status: statuses,
    });

    where.push({ id: { in: animals.map((animal) => animal.id) } });
  }

  const adoptionOptions = animalSearchParams.getAdoptionOptions();
  if (adoptionOptions.length > 0) {
    where.push({
      status: { in: [Status.ADOPTED] },
      adoptionOption: { in: adoptionOptions },
    });
  }

  const minAdoptionDate = animalSearchParams.getMinAdoptionDate();
  const maxAdoptionDate = animalSearchParams.getMaxAdoptionDate();
  if (minAdoptionDate != null || maxAdoptionDate != null) {
    const adoptionDate: Prisma.DateTimeFilter = {};

    if (minAdoptionDate != null) {
      adoptionDate.gte = minAdoptionDate;
    }

    if (maxAdoptionDate != null) {
      adoptionDate.lte = maxAdoptionDate;
    }

    where.push({
      status: { in: [Status.ADOPTED] },
      adoptionDate,
    });
  }

  if (isCurrentUserAnimalAdmin) {
    const isSterilized = animalSearchParams.getIsSterilized();
    if (isSterilized.length > 0) {
      const conditions: Prisma.AnimalWhereInput[] = [];

      if (isSterilized.includes(AnimalSearchParams.IsSterilized.YES)) {
        conditions.push({ isSterilized: true, isSterilizationMandatory: true });
      }

      if (isSterilized.includes(AnimalSearchParams.IsSterilized.NO)) {
        conditions.push({
          isSterilized: false,
          isSterilizationMandatory: true,
        });
      }

      if (
        isSterilized.includes(AnimalSearchParams.IsSterilized.NOT_MANDATORY)
      ) {
        conditions.push({
          isSterilized: false,
          isSterilizationMandatory: false,
        });
      }

      where.push({ OR: conditions });
    }
  }

  if (isCurrentUserAnimalAdmin) {
    const noVaccination = animalSearchParams.getNoVaccination();
    if (noVaccination) {
      where.push({ nextVaccinationDate: null });
    }
  }

  if (isCurrentUserAnimalAdmin) {
    const minVaccinationDate = animalSearchParams.getMinVaccinationDate();
    const maxVaccinationDate = animalSearchParams.getMaxVaccinationDate();
    if (minVaccinationDate != null || maxVaccinationDate != null) {
      const nextVaccinationDate: Prisma.DateTimeFilter = {};

      if (minVaccinationDate != null) {
        nextVaccinationDate.gte = minVaccinationDate;
      }

      if (maxVaccinationDate != null) {
        nextVaccinationDate.lte = maxVaccinationDate;
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
      skip: pageSearchParams.getPage() * ANIMAL_COUNT_PER_PAGE,
      take: ANIMAL_COUNT_PER_PAGE,
      orderBy:
        sort === AnimalSearchParams.Sort.NAME
          ? { name: "asc" }
          : sort === AnimalSearchParams.Sort.BIRTHDATE
          ? { birthdate: "desc" }
          : sort === AnimalSearchParams.Sort.VACCINATION
          ? { nextVaccinationDate: "asc" }
          : { pickUpDate: "desc" },
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

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Tous les animaux") }];
};

export default function Route() {
  const { totalCount, pageCount, animals, canCreate } =
    useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();
  const animalSearchParams = new AnimalSearchParams(searchParams);

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
                <BaseLink to="/animals/new/profile">Créer</BaseLink>
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
                  !animalSearchParams.isEmpty() ? (
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
