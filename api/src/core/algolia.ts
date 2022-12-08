import algoliasearch from "algoliasearch";
import invariant from "tiny-invariant";

invariant(process.env.ALGOLIA_ID != null, "ALGOLIA_ID must be defined.");

invariant(
  process.env.ALGOLIA_ADMIN_KEY != null,
  "ALGOLIA_ADMIN_KEY must be defined."
);

export const AlgoliaClient = algoliasearch(
  process.env.ALGOLIA_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

export function createSearchFilters(
  params: Record<string, boolean | string | string[] | undefined | null>
): string | undefined {
  let filters: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          filters.push(value.map((value) => `${key}:${value}`).join(" OR "));
        }
      } else {
        filters.push(`${key}:${value}`);
      }
    }
  });

  if (filters.length === 0) {
    return undefined;
  }

  if (filters.length > 1) {
    filters = filters.map((value) =>
      value.includes(" OR ") ? `(${value})` : value
    );
  }

  return filters.join(" AND ");
}
