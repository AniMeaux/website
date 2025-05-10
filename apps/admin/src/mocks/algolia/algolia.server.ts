import { breedHandlers } from "#mocks/algolia/breed.server";
import { colorHandlers } from "#mocks/algolia/color.server";
import { fosterFamilyHandlers } from "#mocks/algolia/foster-family.server";
import { userHandlers } from "#mocks/algolia/user.server";

export const algoliaHandlers = [
  ...breedHandlers,
  ...colorHandlers,
  ...fosterFamilyHandlers,
  ...userHandlers,
];
