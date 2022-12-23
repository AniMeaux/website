import { PickUpLocationSearchParams } from "#/animals/searchParams";
import { algolia } from "#/core/algolia/algolia.server";

export async function searchPickUpLocation(
  searchParams: PickUpLocationSearchParams,
  maxCount: number
) {
  const text = searchParams.getText();

  return await algolia.animal.searchPickUpLocation(text ?? "", {
    maxFacetHits: maxCount,
  });
}
