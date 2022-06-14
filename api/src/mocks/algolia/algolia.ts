import { animalHandlers } from "./animal";
import { breedHandlers } from "./breed";
import { colorHandlers } from "./color";
import { fosterFamilyHandlers } from "./fosterFamily";
import { userHandlers } from "./user";

export const algoliaHandlers = [
  ...animalHandlers,
  ...breedHandlers,
  ...colorHandlers,
  ...fosterFamilyHandlers,
  ...userHandlers,
];
