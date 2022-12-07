import { ColorSearchParams } from "~/colors/searchParams";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";

const SEARCH_COUNT = 6;

export async function searchColors(searchParams: ColorSearchParams) {
  const text = searchParams.getText();

  // Don't use Algolia when there are no text search.
  if (text == null) {
    const colors = await prisma.color.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
      take: SEARCH_COUNT,
    });

    return colors.map((breed) => ({ ...breed, highlightedName: breed.name }));
  }

  return await algolia.color.search(text, { hitsPerPage: SEARCH_COUNT });
}
