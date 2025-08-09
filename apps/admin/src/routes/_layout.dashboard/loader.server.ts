import {
  HAS_UP_COMMING_DIAGNOSE_CONDITIONS,
  HAS_UP_COMMING_STERILISATION_CONDITIONS,
  HAS_UP_COMMING_VACCINATION_CONDITIONS,
} from "#animals/situation/health";
import { ACTIVE_ANIMAL_STATUS } from "#animals/status";
import { db } from "#core/db.server";
import { prisma } from "#core/prisma.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { hasGroups } from "#users/groups";
import type { Prisma } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
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

  const dogsToDiagnoseWhere: Prisma.AnimalWhereInput = {
    status: { in: HAS_UP_COMMING_DIAGNOSE_CONDITIONS.status },
    species: { in: HAS_UP_COMMING_DIAGNOSE_CONDITIONS.species },
    diagnosis: { in: HAS_UP_COMMING_DIAGNOSE_CONDITIONS.diagnosis },
    birthdate: {
      lte: DateTime.now()
        .minus({ months: HAS_UP_COMMING_DIAGNOSE_CONDITIONS.ageInMonths })
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

    dogToDiagnoseCount: prisma.animal.count({
      where: dogsToDiagnoseWhere,
    }),

    dogsToDiagnose: prisma.animal.findMany({
      take: 6,
      where: dogsToDiagnoseWhere,
      orderBy: { pickUpDate: "asc" },
      select: {
        alias: true,
        breed: { select: { name: true } },
        avatar: true,
        gender: true,
        id: true,
        name: true,
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
