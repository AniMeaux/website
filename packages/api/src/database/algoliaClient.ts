import algoliasearch from "algoliasearch";

export const AlgoliaClient = algoliasearch(
  process.env.ALGOLIA_ID,
  process.env.ALGOLIA_ADMIN_KEY
);
