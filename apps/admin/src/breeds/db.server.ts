import { Species } from "@prisma/client";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/prisma.server";

export class BreedDbDelegate {
  async fuzzySearch({
    name,
    species = [],
    maxHitCount,
  }: {
    name?: string;
    species?: Species[];
    maxHitCount: number;
  }) {
    // Don't use Algolia when there are no text search.
    if (name == null) {
      const breeds = await prisma.breed.findMany({
        where: { species: species == null ? undefined : { in: species } },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
        take: maxHitCount,
      });

      return breeds.map((breed) => ({
        ...breed,
        highlightedName: breed.name,
      }));
    }

    return await algolia.breed.search({
      name,
      species,
      hitsPerPage: maxHitCount,
    });
  }
}
