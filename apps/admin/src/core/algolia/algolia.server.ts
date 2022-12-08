import algoliasearch from "algoliasearch";
import invariant from "tiny-invariant";
import { createAnimalDelegate } from "~/animals/algolia.server";
import { createBreedDelegate } from "~/breeds/algolia.server";
import { createColorDelegate } from "~/colors/algolia.server";
import { createSearchableResourceDelegate } from "~/searchableResources/algolia.server";
import { createUserDelegate } from "~/users/algolia.server";

invariant(process.env.ALGOLIA_ID != null, "ALGOLIA_ID must be defined.");

invariant(
  process.env.ALGOLIA_ADMIN_KEY != null,
  "ALGOLIA_ADMIN_KEY must be defined."
);

const client = algoliasearch(
  process.env.ALGOLIA_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

export const algolia = {
  animal: createAnimalDelegate(client),
  breed: createBreedDelegate(client),
  color: createColorDelegate(client),
  searchableResource: createSearchableResourceDelegate(client),
  user: createUserDelegate(client),
};
