import { AnimalItem, AnimalSmallItem } from "#animals/item.tsx";
import {
  AnimalSearchParams,
  AnimalSort,
  AnimalSterilization,
} from "#animals/searchParams.ts";
import {
  HAS_UP_COMMING_STERILISATION_CONDITIONS,
  HAS_UP_COMMING_VACCINATION_CONDITIONS,
  formatNextVaccinationDate,
  getNextVaccinationState,
} from "#animals/situation/health.ts";
import { ACTIVE_ANIMAL_STATUS } from "#animals/status.tsx";
import { Action } from "#core/actions.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { Empty } from "#core/dataDisplay/empty.tsx";
import { db } from "#core/db.server.ts";
import { Card } from "#core/layout/card.tsx";
import { PageLayout } from "#core/layout/page.tsx";
import { Routes } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { prisma } from "#core/prisma.server.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { hasGroups } from "#users/groups.tsx";
import { formatAge } from "@animeaux/core";
import type { Prisma } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { promiseHash } from "remix-utils/promise";
import invariant from "tiny-invariant";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const activeAnimalsWhere: Prisma.AnimalWhereInput = {
    status: { in: ACTIVE_ANIMAL_STATUS },
  };

  const animalsToSterilizeWhere: Prisma.AnimalWhereInput = {
    birthdate: {
      lte: DateTime.now()
        .minus({ months: HAS_UP_COMMING_STERILISATION_CONDITIONS.ageInMonths })
        .toJSDate(),
    },
    isSterilizationMandatory:
      HAS_UP_COMMING_STERILISATION_CONDITIONS.isSterilizationMandatory,
    isSterilized: HAS_UP_COMMING_STERILISATION_CONDITIONS.isSterilized,
    species: { in: HAS_UP_COMMING_STERILISATION_CONDITIONS.species },
    status: { in: HAS_UP_COMMING_STERILISATION_CONDITIONS.status },
  };

  const animalsToVaccinateWhere: Prisma.AnimalWhereInput = {
    status: { in: HAS_UP_COMMING_VACCINATION_CONDITIONS.status },
    nextVaccinationDate: {
      lte: DateTime.now()
        .plus({
          days: HAS_UP_COMMING_VACCINATION_CONDITIONS.nextVaccinationInDays,
        })
        .toJSDate(),
    },
  };

  const managedAnimalswhere: Prisma.AnimalWhereInput = {
    managerId: currentUser.id,
    status: { in: ACTIVE_ANIMAL_STATUS },
  };

  const isCurrentUserManager = hasGroups(currentUser, [
    UserGroup.ANIMAL_MANAGER,
  ]);

  const data = await promiseHash({
    activeAnimalCount: prisma.animal.count({ where: activeAnimalsWhere }),

    activeAnimals: prisma.animal.findMany({
      take: 12,
      where: activeAnimalsWhere,
      orderBy: { pickUpDate: "desc" },
      select: {
        alias: true,
        avatar: true,
        birthdate: true,
        gender: true,
        id: true,
        isSterilizationMandatory: true,
        isSterilized: true,
        manager: { select: { displayName: true } },
        name: true,
        nextVaccinationDate: true,
        species: true,
        status: true,
      },
    }),

    animalToSterilizeCount: prisma.animal.count({
      where: animalsToSterilizeWhere,
    }),

    animalsToSterilize: prisma.animal.findMany({
      take: 6,
      where: animalsToSterilizeWhere,
      orderBy: { birthdate: "desc" },
      select: {
        alias: true,
        birthdate: true,
        avatar: true,
        gender: true,
        id: true,
        name: true,
        status: true,
      },
    }),

    animalToVaccinateCount: prisma.animal.count({
      where: animalsToVaccinateWhere,
    }),

    animalsToVaccinate: prisma.animal.findMany({
      take: 6,
      where: animalsToVaccinateWhere,
      orderBy: { nextVaccinationDate: "asc" },
      select: {
        alias: true,
        birthdate: true,
        avatar: true,
        gender: true,
        id: true,
        name: true,
        nextVaccinationDate: true,
        status: true,
      },
    }),

    managedAnimalCount: isCurrentUserManager
      ? prisma.animal.count({ where: managedAnimalswhere })
      : Promise.resolve(0),

    managedAnimals: isCurrentUserManager
      ? prisma.animal.findMany({
          take: 12,
          where: managedAnimalswhere,
          orderBy: { pickUpDate: "desc" },
          select: {
            alias: true,
            avatar: true,
            birthdate: true,
            gender: true,
            id: true,
            isSterilizationMandatory: true,
            isSterilized: true,
            name: true,
            nextVaccinationDate: true,
            species: true,
            status: true,
          },
        })
      : Promise.resolve(null),
  });

  return json({
    ...data,
    isCurrentUserManager,
    currentUser,

    // Just for type checking.
    // At this point `nextVaccinationDate` must be defined.
    animalsToVaccinate: data.animalsToVaccinate.map(
      ({ nextVaccinationDate, ...animal }) => {
        invariant(
          nextVaccinationDate != null,
          "nextVaccinationDate should be defined",
        );

        return { ...animal, nextVaccinationDate };
      },
    ),
  });
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Tableau de bord") }];
};

export default function Route() {
  const { isCurrentUserManager } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
      <section className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
        <AnimalsToVaccinateCard />
        <AnimalsToSterilizeCard />
      </section>

      {isCurrentUserManager ? <ManagedAnimalsCard /> : null}
      <ActiveAnimalsCard />
    </PageLayout.Content>
  );
}

function AnimalsToVaccinateCard() {
  const { animalToVaccinateCount, animalsToVaccinate } =
    useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {animalToVaccinateCount === 0
            ? "Vaccinations prévues"
            : animalToVaccinateCount > 1
              ? `${animalToVaccinateCount} vaccinations prévues`
              : "1 vaccination prévue"}
        </Card.Title>

        {animalToVaccinateCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.search.toString(),
                search: AnimalSearchParams.stringify({
                  sort: AnimalSort.VACCINATION,
                  nextVaccinationDateEnd: DateTime.now()
                    .plus({
                      days: HAS_UP_COMMING_VACCINATION_CONDITIONS.nextVaccinationInDays,
                    })
                    .toISODate(),
                  statuses: new Set(
                    HAS_UP_COMMING_VACCINATION_CONDITIONS.status,
                  ),
                }),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasListItems>
        {animalToVaccinateCount === 0 ? (
          <Empty
            isCompact
            icon="💉"
            iconAlt="Seringue"
            title="Aucun animal à vacciner"
            message="Dans les 15 jours à venir."
            titleElementType="h3"
            className="h-full"
          />
        ) : (
          <ul className="grid grid-cols-1 xs:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-1">
            {animalsToVaccinate.map((animal) => (
              <li key={animal.id} className="flex flex-col">
                <AnimalSmallItem
                  animal={animal}
                  hasError={
                    getNextVaccinationState(
                      animal.nextVaccinationDate,
                      animal.status,
                    ) === "past"
                  }
                  secondaryLabel={
                    <span className="first-letter:capitalize">
                      {formatNextVaccinationDate(animal.nextVaccinationDate)}
                    </span>
                  }
                  imageLoading="eager"
                />
              </li>
            ))}
          </ul>
        )}
      </Card.Content>
    </Card>
  );
}

function AnimalsToSterilizeCard() {
  const { animalToSterilizeCount, animalsToSterilize } =
    useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {animalToSterilizeCount === 0
            ? "Stérilisations à prévoir"
            : animalToSterilizeCount > 1
              ? `${animalToSterilizeCount} stérilisations à prévoir`
              : "1 stérilisation à prévoir"}
        </Card.Title>

        {animalToSterilizeCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.search.toString(),
                search: AnimalSearchParams.stringify({
                  sort: AnimalSort.BIRTHDATE,
                  species: new Set(
                    HAS_UP_COMMING_STERILISATION_CONDITIONS.species,
                  ),
                  sterilizations: new Set([AnimalSterilization.NO]),
                  birthdateEnd: DateTime.now()
                    .minus({
                      months:
                        HAS_UP_COMMING_STERILISATION_CONDITIONS.ageInMonths,
                    })
                    .toISODate(),
                  statuses: new Set(
                    HAS_UP_COMMING_STERILISATION_CONDITIONS.status,
                  ),
                }),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasListItems>
        {animalToSterilizeCount === 0 ? (
          <Empty
            isCompact
            icon="✂️"
            iconAlt="Ciseaux"
            title="Aucun animal à stériliser"
            message="À leur 6 mois, chiens et chats doivent être stérilisés."
            titleElementType="h3"
            className="h-full"
          />
        ) : (
          <ul className="grid grid-cols-1 xs:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-1">
            {animalsToSterilize.map((animal) => (
              <li key={animal.id} className="flex flex-col">
                <AnimalSmallItem
                  animal={animal}
                  secondaryLabel={formatAge(animal.birthdate)}
                  imageLoading="eager"
                />
              </li>
            ))}
          </ul>
        )}
      </Card.Content>
    </Card>
  );
}

function ManagedAnimalsCard() {
  const { currentUser, managedAnimalCount, managedAnimals } =
    useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {managedAnimalCount === 0
            ? "À votre charge"
            : managedAnimalCount > 1
              ? `${managedAnimalCount} animaux à votre charge`
              : "1 animal à votre charge"}
        </Card.Title>

        {managedAnimalCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.search.toString(),
                search: AnimalSearchParams.stringify({
                  statuses: new Set(ACTIVE_ANIMAL_STATUS),
                  managersId: new Set([currentUser.id]),
                }),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasHorizontalScroll={managedAnimalCount > 0}>
        {managedAnimalCount === 0 || managedAnimals == null ? (
          <Empty
            isCompact
            icon="🦤"
            iconAlt="Dodo bird"
            title="Aucun animal à votre charge"
            titleElementType="h3"
            message="Pour l’instant ;)"
          />
        ) : (
          <ul className="flex">
            {managedAnimals.map((animal) => (
              <li
                key={animal.id}
                className="flex-none flex flex-col first:pl-0.5 last:pr-0.5 md:first:pl-1 md:last:pr-1"
              >
                <AnimalItem
                  animal={animal}
                  imageSizeMapping={{ default: "150px" }}
                  className="w-[160px] md:w-[170px]"
                />
              </li>
            ))}
          </ul>
        )}
      </Card.Content>
    </Card>
  );
}

function ActiveAnimalsCard() {
  const { activeAnimalCount, activeAnimals } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {activeAnimalCount === 0
            ? "Animaux en charge"
            : activeAnimalCount > 1
              ? `${activeAnimalCount} animaux en charge`
              : "1 animal en charge"}
        </Card.Title>

        {activeAnimalCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.search.toString(),
                search: AnimalSearchParams.stringify({
                  statuses: new Set(ACTIVE_ANIMAL_STATUS),
                }),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasHorizontalScroll={activeAnimalCount > 0}>
        {activeAnimalCount === 0 ? (
          <Empty
            isCompact
            icon="🦤"
            iconAlt="Dodo bird"
            title="Aucun animal en charge"
            titleElementType="h3"
            message="Pour l’instant ;)"
          />
        ) : (
          <ul className="flex">
            {activeAnimals.map((animal) => (
              <li
                key={animal.id}
                className="flex-none flex flex-col first:pl-0.5 last:pr-0.5 md:first:pl-1 md:last:pr-1"
              >
                <AnimalItem
                  animal={animal}
                  imageSizeMapping={{ default: "150px" }}
                  className="w-[160px] md:w-[170px]"
                />
              </li>
            ))}
          </ul>
        )}
      </Card.Content>
    </Card>
  );
}
