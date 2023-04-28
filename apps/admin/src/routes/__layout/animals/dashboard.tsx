import { formatAge } from "@animeaux/shared";
import { Prisma, Species, Status, UserGroup } from "@prisma/client";
import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { promiseHash } from "remix-utils";
import invariant from "tiny-invariant";
import { AnimalItem, AnimalSmallItem } from "~/animals/item";
import { AnimalSearchParams } from "~/animals/searchParams";
import {
  formatNextVaccinationDate,
  hasPastVaccination,
} from "~/animals/situation/health";
import { ACTIVE_ANIMAL_STATUS, SORTED_STATUS } from "~/animals/status";
import { Action } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { Empty } from "~/core/dataDisplay/empty";
import { prisma } from "~/core/db.server";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { hasGroups } from "~/users/groups";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
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
    birthdate: { lte: DateTime.now().minus({ months: 6 }).toJSDate() },
    isSterilizationMandatory: true,
    isSterilized: false,
    species: { in: [Species.CAT, Species.DOG] },
    status: { not: Status.DECEASED },
  };

  const animalsToVaccinateWhere: Prisma.AnimalWhereInput = {
    status: { in: ACTIVE_ANIMAL_STATUS },
    nextVaccinationDate: {
      lte: DateTime.now().plus({ days: 15 }).toJSDate(),
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
      : Promise.resolve([]),
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
          "nextVaccinationDate should be defined"
        );

        return { ...animal, nextVaccinationDate };
      }
    ),
  });
}

export const meta: MetaFunction = () => {
  return { title: getPageTitle("Tableau de bord") };
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
                pathname: "/animals/search",
                search: new AnimalSearchParams()
                  .setSort(AnimalSearchParams.Sort.VACCINATION)
                  .setMaxVaccinationDate(
                    DateTime.now().plus({ days: 15 }).toJSDate()
                  )
                  .setStatuses(ACTIVE_ANIMAL_STATUS)
                  .toString(),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content>
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
          <ul className="grid grid-cols-1 gap-x-2 gap-y-1 xs:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:gap-x-4 md:gap-y-2">
            {animalsToVaccinate.map((animal) => (
              <li key={animal.id} className="flex flex-col">
                <AnimalSmallItem
                  animal={animal}
                  hasError={hasPastVaccination(animal)}
                  secondaryLabel={
                    <span className="first-letter:capitalize">
                      {formatNextVaccinationDate(animal)}
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
                pathname: "/animals/search",
                search: new AnimalSearchParams()
                  .setSort(AnimalSearchParams.Sort.BIRTHDATE)
                  .setSpecies([Species.CAT, Species.DOG])
                  .setIsSterilized([AnimalSearchParams.IsSterilized.NO])
                  .setMaxBirthdate(
                    DateTime.now().minus({ months: 6 }).toJSDate()
                  )
                  .setStatuses(
                    SORTED_STATUS.filter((status) => status !== Status.DECEASED)
                  )
                  .toString(),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content>
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
          <ul className="grid grid-cols-1 gap-x-2 gap-y-1 xs:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:gap-x-4 md:gap-y-2">
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
                pathname: "/animals/search",
                search: new AnimalSearchParams()
                  .setStatuses(ACTIVE_ANIMAL_STATUS)
                  .setManagersId([currentUser.id])
                  .toString(),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasHorizontalScroll={managedAnimalCount > 0}>
        {managedAnimalCount === 0 ? (
          <Empty
            isCompact
            icon="🦤"
            iconAlt="Dodo bird"
            title="Aucun animal à votre charge"
            titleElementType="h3"
            message="Pour l’instant ;)"
          />
        ) : (
          <ul className="flex gap-1">
            {managedAnimals.map((animal) => (
              <li
                key={animal.id}
                className="flex-none flex flex-col first:pl-1 last:pr-1 md:first:pl-2 md:last:pr-2"
              >
                <AnimalItem
                  animal={animal}
                  imageSizes={{ default: "300px" }}
                  className="w-[150px]"
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
                pathname: "/animals/search",
                search: new AnimalSearchParams()
                  .setStatuses(ACTIVE_ANIMAL_STATUS)
                  .toString(),
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
          <ul className="flex gap-1">
            {activeAnimals.map((animal) => (
              <li
                key={animal.id}
                className="flex-none flex flex-col first:pl-1 last:pr-1 md:first:pl-2 md:last:pr-2"
              >
                <AnimalItem
                  animal={animal}
                  imageSizes={{ default: "300px" }}
                  className="w-[150px]"
                />
              </li>
            ))}
          </ul>
        )}
      </Card.Content>
    </Card>
  );
}
