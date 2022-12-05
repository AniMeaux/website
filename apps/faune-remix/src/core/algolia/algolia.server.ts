import algoliasearch from "algoliasearch";
import invariant from "tiny-invariant";
import { createAnimalDelegate } from "~/animals/algolia.server";
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
  user: createUserDelegate(client),
  animal: createAnimalDelegate(client),
};
