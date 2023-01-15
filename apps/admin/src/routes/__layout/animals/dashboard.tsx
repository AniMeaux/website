import { formatAge } from "@animeaux/shared";
import { Prisma, Species, Status, UserGroup } from "@prisma/client";
import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { AnimalItem, AnimalSmallItem } from "~/animals/item";
import { AnimalSearchParams } from "~/animals/searchParams";
import { ACTIVE_ANIMAL_STATUS, SORTED_STATUS } from "~/animals/status";
import { actionClassName } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { Empty } from "~/core/dataDisplay/empty";
import { prisma } from "~/core/db.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { PageContent } from "~/core/layout/page";
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
    UserGroup.VETERINARIAN,
    UserGroup.VOLUNTEER,
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

  const managedAnimalswhere: Prisma.AnimalWhereInput = {
    managerId: currentUser.id,
    status: { in: ACTIVE_ANIMAL_STATUS },
  };

  const isCurrentUserManager = hasGroups(currentUser, [
    UserGroup.ANIMAL_MANAGER,
  ]);

  const [
    activeAnimalCount,
    activeAnimals,
    animalToSterilizeCount,
    animalsToSterilize,
    managedAnimalCount,
    managedAnimals,
  ] = await Promise.all([
    prisma.animal.count({ where: activeAnimalsWhere }),
    prisma.animal.findMany({
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
        species: true,
        status: true,
      },
    }),

    prisma.animal.count({ where: animalsToSterilizeWhere }),
    prisma.animal.findMany({
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

    isCurrentUserManager
      ? prisma.animal.count({ where: managedAnimalswhere })
      : Promise.resolve(0),

    isCurrentUserManager
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
            species: true,
            status: true,
          },
        })
      : [],
  ]);

  return json({
    isCurrentUserManager,
    currentUser,
    activeAnimalCount,
    activeAnimals,
    animalToSterilizeCount,
    animalsToSterilize,
    managedAnimalCount,
    managedAnimals,
  });
}

export default function AnimalDashboard() {
  const { isCurrentUserManager } = useLoaderData<typeof loader>();

  return (
    <PageContent className="flex flex-col gap-1 md:gap-2">
      <AnimalsToSterilizeCard />
      {isCurrentUserManager ? <ManagedAnimalsCard /> : null}
      <ActiveAnimalsCard />
    </PageContent>
  );
}

function AnimalsToSterilizeCard() {
  const { animalToSterilizeCount, animalsToSterilize } =
    useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {animalToSterilizeCount === 0
            ? "Stérilisations à prévoir"
            : animalToSterilizeCount > 1
            ? `${animalToSterilizeCount} stérilisations à prévoir`
            : "1 stérilisation à prévoir"}
        </CardTitle>

        {animalToSterilizeCount > 0 ? (
          <BaseLink
            to={{
              pathname: "/animals/search",
              search: new AnimalSearchParams()
                .setSpecies([Species.CAT, Species.DOG])
                .setIsSterilized(AnimalSearchParams.IsSterilized.NO)
                .setMaxBirthdate(DateTime.now().minus({ months: 6 }).toJSDate())
                .setStatuses(
                  SORTED_STATUS.filter((status) => status !== Status.DECEASED)
                )
                .toString(),
            }}
            className={actionClassName.standalone({
              variant: "text",
            })}
          >
            Tout voir
          </BaseLink>
        ) : null}
      </CardHeader>

      <CardContent>
        {animalToSterilizeCount === 0 ? (
          <Empty
            icon="✂️"
            iconAlt="Ciseaux"
            title="Aucun animal à stériliser"
            message="À leur 6 mois, chiens et chats doivent être stérilisés."
            titleElementType="h3"
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
      </CardContent>
    </Card>
  );
}

function ManagedAnimalsCard() {
  const { currentUser, managedAnimalCount, managedAnimals } =
    useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {managedAnimalCount === 0
            ? "À votre charge"
            : managedAnimalCount > 1
            ? `${managedAnimalCount} animaux à votre charge`
            : "1 animal à votre charge"}
        </CardTitle>

        {managedAnimalCount > 0 ? (
          <BaseLink
            to={{
              pathname: "/animals/search",
              search: new AnimalSearchParams()
                .setStatuses(ACTIVE_ANIMAL_STATUS)
                .setManagersId([currentUser.id])
                .toString(),
            }}
            className={actionClassName.standalone({
              variant: "text",
            })}
          >
            Tout voir
          </BaseLink>
        ) : null}
      </CardHeader>

      <CardContent hasHorizontalScroll={managedAnimalCount > 0}>
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
      </CardContent>
    </Card>
  );
}

function ActiveAnimalsCard() {
  const { activeAnimalCount, activeAnimals } = useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {activeAnimalCount === 0
            ? "Animaux en charge"
            : activeAnimalCount > 1
            ? `${activeAnimalCount} animaux en charge`
            : "1 animal en charge"}
        </CardTitle>

        {activeAnimalCount > 0 ? (
          <BaseLink
            to={{
              pathname: "/animals/search",
              search: new AnimalSearchParams()
                .setStatuses(ACTIVE_ANIMAL_STATUS)
                .toString(),
            }}
            className={actionClassName.standalone({
              variant: "text",
            })}
          >
            Tout voir
          </BaseLink>
        ) : null}
      </CardHeader>

      <CardContent hasHorizontalScroll={activeAnimalCount > 0}>
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
      </CardContent>
    </Card>
  );
}
