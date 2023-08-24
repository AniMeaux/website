import { ACTIVE_ANIMAL_STATUS } from "#animals/status.tsx";
import { algolia } from "#core/algolia/algolia.server.ts";
import { NotFoundError } from "#core/errors.server.ts";
import { Routes } from "#core/navigation.ts";
import { prisma } from "#core/prisma.server.ts";
import { Animal, AnimalDraft, Prisma, Status, UserGroup } from "@prisma/client";
import { redirect } from "@remix-run/node";

type SituationKeys =
  | "adoptionDate"
  | "adoptionOption"
  | "comments"
  | "fosterFamilyId"
  | "isSterilizationMandatory"
  | "isSterilized"
  | "isVaccinationMandatory"
  | "managerId"
  | "nextVaccinationDate"
  | "pickUpDate"
  | "pickUpLocation"
  | "pickUpReason"
  | "screeningFelv"
  | "screeningFiv"
  | "status";

export type AnimalSituation = Pick<Animal, SituationKeys>;
type AnimalDraftSituation = Pick<AnimalDraft, SituationKeys>;

export class MissingAdoptionDateError extends Error {}
export class MissingAdoptionOptionError extends Error {}
export class MissingManagerError extends Error {}
export class MissingNextVaccinationError extends Error {}
export class MissingPickUpLocationError extends Error {}
export class NotManagerError extends Error {}

export class AnimalSituationDbDelegate {
  async update(animalId: Animal["id"], data: AnimalSituation) {
    await prisma.$transaction(async (prisma) => {
      const currentAnimal = await prisma.animal.findUnique({
        where: { id: animalId },
        select: {
          managerId: true,
          nextVaccinationDate: true,
          pickUpLocation: true,
        },
      });
      if (currentAnimal == null) {
        throw new NotFoundError();
      }

      await this.validate(prisma, data, currentAnimal);
      this.normalize(data);

      await prisma.animal.update({ where: { id: animalId }, data });

      await algolia.animal.update(animalId, {
        status: data.status,
        pickUpDate: data.pickUpDate.getTime(),
        pickUpLocation: data.pickUpLocation,
      });
    });
  }

  async updateDraft(ownerId: AnimalDraft["ownerId"], data: AnimalSituation) {
    await prisma.$transaction(async (prisma) => {
      await this.validate(prisma, data);
      this.normalize(data);
      await prisma.animalDraft.update({ where: { ownerId }, data });
    });
  }

  async validate(
    prisma: Prisma.TransactionClient,
    newData: AnimalSituation,
    currentData?: null | Pick<
      AnimalSituation,
      "managerId" | "nextVaccinationDate" | "pickUpLocation"
    >
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
      // Only check the manager if it has changed.
      // They could have changed groups or been blocked but we still want to be
      // able to update the animal.
      if (newData.managerId !== currentData?.managerId) {
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
    }

    // Allow old animals (without a pick up location) to be updated without
    // setting one. But we can't unset a pick up location.
    if (
      newData.pickUpLocation == null &&
      (currentData == null || currentData?.pickUpLocation != null)
    ) {
      throw new MissingPickUpLocationError();
    }

    // Once a vaccination date is set, we cannot stop vaccinating the animal.
    if (
      newData.isVaccinationMandatory &&
      newData.nextVaccinationDate == null &&
      currentData?.nextVaccinationDate != null
    ) {
      throw new MissingNextVaccinationError();
    }
  }

  normalize(data: AnimalSituation) {
    if (data.status !== Status.ADOPTED) {
      data.adoptionDate = null;
      data.adoptionOption = null;
    }

    if (!ACTIVE_ANIMAL_STATUS.includes(data.status)) {
      data.fosterFamilyId = null;
    }

    if (!data.isVaccinationMandatory) {
      data.nextVaccinationDate = null;
    }
  }

  async assertDraftIsValid(draft?: null | AnimalDraftSituation) {
    if (!this.draftHasSituation(draft)) {
      throw redirect(Routes.animals.new.situation.toString());
    }

    try {
      await this.validate(prisma, draft);
    } catch (error) {
      throw redirect(Routes.animals.new.situation.toString());
    }
  }

  draftHasSituation(
    draft?: null | AnimalDraftSituation
  ): draft is AnimalSituation {
    return (
      draft != null &&
      draft.isSterilizationMandatory != null &&
      draft.isSterilized != null &&
      draft.isVaccinationMandatory != null &&
      draft.managerId != null &&
      draft.pickUpDate != null &&
      draft.pickUpLocation != null &&
      draft.pickUpReason != null &&
      draft.screeningFelv != null &&
      draft.screeningFiv != null &&
      draft.status != null
    );
  }
}
