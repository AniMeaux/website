import { BreedSearchParams } from "#/breeds/searchParams";
import { algolia } from "#/core/algolia/algolia.server";
import { prisma } from "#/core/db.server";

const SEARCH_COUNT = 6;

export async function searchBreeds(searchParams: BreedSearchParams) {
  const text = searchParams.getText();
  const species = searchParams.getSpecies();

  // Don't use Algolia when there are no text search.
  if (text == null) {
    const breeds = await prisma.breed.findMany({
      where: { species: species ?? undefined },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
      take: SEARCH_COUNT,
    });

    return breeds.map((breed) => ({ ...breed, highlightedName: breed.name }));
  }

  return await algolia.breed.search(
    text,
    { species },
    { hitsPerPage: SEARCH_COUNT }
  );
}
