import { Animal, AnimalDraft, Prisma, Status, UserGroup } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { ACTIVE_ANIMAL_STATUS } from "~/animals/status";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";

type SituationKeys =
  | "adoptionDate"
  | "adoptionOption"
  | "comments"
  | "fosterFamilyId"
  | "managerId"
  | "pickUpDate"
  | "pickUpLocation"
  | "pickUpReason"
  | "status";

export type AnimalSituation = Pick<Animal, SituationKeys>;
type AnimalDraftSituation = Pick<AnimalDraft, SituationKeys>;

export class MissingAdoptionDateError extends Error {}
export class MissingAdoptionOptionError extends Error {}
export class MissingManagerError extends Error {}
export class NotManagerError extends Error {}
export class MissingPickUpLocationError extends Error {}

export async function updateAnimalSituation(
  animalId: Animal["id"],
  data: AnimalSituation
) {
  await prisma.$transaction(async (prisma) => {
    const currentAnimal = await prisma.animal.findUnique({
      where: { id: animalId },
      select: { managerId: true, pickUpLocation: true },
    });
    if (currentAnimal == null) {
      throw new NotFoundError();
    }

    await validateSituation(prisma, data, currentAnimal);
    normalizeSituation(data);

    const animal = await prisma.animal.update({
      where: { id: animalId },
      data,
      select: { alias: true, name: true },
    });

    await algolia.animal.update(animalId, {
      status: data.status,
      pickUpLocation: data.pickUpLocation,
    });

    await algolia.searchableResource.createOrUpdateAnimal(animalId, {
      alias: animal.alias,
      name: animal.name,
      pickUpDate: data.pickUpDate,
    });
  });
}

export async function updateAnimalSituationDraft(
  ownerId: AnimalDraft["ownerId"],
  data: AnimalSituation
) {
  await prisma.$transaction(async (prisma) => {
    await validateSituation(prisma, data);
    normalizeSituation(data);
    await prisma.animalDraft.update({ where: { ownerId }, data });
  });
}

export async function validateSituation(
  prisma: Prisma.TransactionClient,
  newData: AnimalSituation,
  currentData?: null | Pick<AnimalSituation, "managerId" | "pickUpLocation">
) {
  if (newData.status === Status.ADOPTED) {
    if (newData.adoptionDate == null) {
      throw new MissingAdoptionDateError();
    }
    if (newData.adoptionOption == null) {
      throw new MissingAdoptionOptionError();
    }
  }

  if (newData.managerId == null) {
    // Allow old animals (without a manager) to be updated without setting
    // one. But we can't unset a manager.
    if (currentData == null || currentData.managerId != null) {
      throw new MissingManagerError();
    }
  } else {
    const manager = await prisma.user.findFirst({
      where: {
        id: newData.managerId,
        isDisabled: false,
        groups: { has: UserGroup.ANIMAL_MANAGER },
      },
    });

    if (manager == null) {
      throw new NotManagerError();
    }
  }

  // Allow old animals (without a pick up location) to be updated without
  // setting one. But we can't unset a pick up location.
  if (
    newData.pickUpLocation == null &&
    (currentData == null || currentData?.pickUpLocation != null)
  ) {
    throw new MissingPickUpLocationError();
  }
}

export function normalizeSituation(data: AnimalSituation) {
  if (data.status !== Status.ADOPTED) {
    data.adoptionDate = null;
    data.adoptionOption = null;
  }

  if (!ACTIVE_ANIMAL_STATUS.includes(data.status)) {
    data.fosterFamilyId = null;
  }
}

export async function assertDraftHasValidSituation(
  draft?: null | AnimalDraftSituation
) {
  if (!hasSituation(draft)) {
    throw redirect("/animals/new/situation");
  }

  try {
    await validateSituation(prisma, draft);
  } catch (error) {
    throw redirect("/animals/new/situation");
  }
}

export function hasSituation(
  draft?: null | AnimalDraftSituation
): draft is AnimalSituation {
  return (
    draft != null &&
    draft.managerId != null &&
    draft.pickUpDate != null &&
    draft.pickUpLocation != null &&
    draft.pickUpReason != null &&
    draft.status != null
  );
}
