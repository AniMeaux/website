import {
  AnimalFamily,
  AnimalFamilyOperations,
  AnimalRelative,
} from "@animeaux/shared";
import { Prisma, UserGroup } from "@prisma/client";
import { number, object } from "yup";
import { assertUserHasGroups, getCurrentUser } from "../core/authentication";
import { prisma } from "../core/db";
import { OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";
import { getDisplayName } from "../entities/animal.entity";

const ANIMAL_FAMILY_COUNT_PER_PAGE = 12;

const animalRelativeWithIncludes = Prisma.validator<Prisma.AnimalArgs>()({
  select: {
    id: true,
    avatar: true,
    name: true,
    alias: true,
  },
});

export const animalFamilyOperations: OperationsImpl<AnimalFamilyOperations> = {
  async getAllAnimalFamilies(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
      UserGroup.VETERINARIAN,
    ]);

    const params = validateParams<"getAllAnimalFamilies">(
      object({ page: number().min(0) }),
      rawParams
    );

    const page = params.page ?? 0;

    const [count, animalFamilies] = await Promise.all([
      prisma.animalFamily.count(),
      prisma.animalFamily.findMany({
        skip: page * ANIMAL_FAMILY_COUNT_PER_PAGE,
        take: ANIMAL_FAMILY_COUNT_PER_PAGE,
        include: {
          parents: { ...animalRelativeWithIncludes },
          children: { ...animalRelativeWithIncludes },
        },
      }),
    ]);

    return {
      hitsTotalCount: count,
      page,
      pageCount: Math.ceil(count / ANIMAL_FAMILY_COUNT_PER_PAGE),
      hits: animalFamilies.map<AnimalFamily>((family) => ({
        id: family.id,
        parents: family.parents.map(mapToRelative),
        children: family.children.map(mapToRelative),
      })),
    };
  },
};

function mapToRelative(
  animal: Prisma.AnimalGetPayload<typeof animalRelativeWithIncludes>
): AnimalRelative {
  return {
    id: animal.id,
    name: getDisplayName(animal),
    avatarId: animal.avatar,
  };
}
