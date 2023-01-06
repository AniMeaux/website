import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";

const SEARCH_COUNT = 6;

export async function fuzzySearchColors({ name }: { name: null | string }) {
  // Don't use Algolia when there are no text search.
  if (name == null) {
    const colors = await prisma.color.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
      take: SEARCH_COUNT,
    });

    return colors.map((breed) => ({ ...breed, highlightedName: breed.name }));
  }

  return await algolia.color.search(name, { hitsPerPage: SEARCH_COUNT });
}
