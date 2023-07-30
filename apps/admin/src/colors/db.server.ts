import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/prisma.server";

export class ColorDbDelegate {
  async fuzzySearch({
    name,
    maxHitCount,
  }: {
    name?: string;
    maxHitCount: number;
  }) {
    // Don't use Algolia when there are no text search.
    if (name == null) {
      const colors = await prisma.color.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
        take: maxHitCount,
      });

      return colors.map((breed) => ({
        ...breed,
        highlightedName: breed.name,
      }));
    }

    return await algolia.color.search({ name, hitsPerPage: maxHitCount });
  }
}
