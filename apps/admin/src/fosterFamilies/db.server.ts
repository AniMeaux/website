import invariant from "tiny-invariant";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import { FosterFamilySearchParams } from "~/fosterFamilies/searchParams";

const SEARCH_COUNT = 6;

export async function searchFosterFamilies(
  searchParams: FosterFamilySearchParams
) {
  const text = searchParams.getText();

  // Don't use Algolia when there are no text search.
  if (text == null) {
    const fosterFamilies = await prisma.fosterFamily.findMany({
      select: { id: true, displayName: true, city: true, zipCode: true },
      orderBy: { displayName: "asc" },
      take: SEARCH_COUNT,
    });

    return fosterFamilies.map((fosterFamily) => ({
      ...fosterFamily,
      highlightedDisplayName: fosterFamily.displayName,
    }));
  }

  const hits = await algolia.fosterFamily.search(text, {
    hitsPerPage: SEARCH_COUNT,
  });

  const fosterFamilies = await prisma.fosterFamily.findMany({
    where: { id: { in: hits.map((hit) => hit.id) } },
    select: { city: true, id: true, zipCode: true },
  });

  return hits.map((hit) => {
    const fosterFamily = fosterFamilies.find(
      (fosterFamily) => fosterFamily.id === hit.id
    );
    invariant(
      fosterFamily != null,
      "Foster family from algolia should exists."
    );

    return { ...hit, ...fosterFamily };
  });
}
