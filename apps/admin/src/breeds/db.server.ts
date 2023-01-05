import { Species } from "@prisma/client";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";

const SEARCH_COUNT = 6;

export async function fuzzySearchBreeds({
  name,
  species,
}: {
  name: null | string;
  species: null | Species;
}) {
  // Don't use Algolia when there are no text search.
  if (name == null) {
    const breeds = await prisma.breed.findMany({
      where: { species: species ?? undefined },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
      take: SEARCH_COUNT,
    });

    return breeds.map((breed) => ({ ...breed, highlightedName: breed.name }));
  }

  return await algolia.breed.search(
    name,
    { species },
    { hitsPerPage: SEARCH_COUNT }
  );
}
