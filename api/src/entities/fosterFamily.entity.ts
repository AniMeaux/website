import { FosterFamily } from "@prisma/client";
import { AlgoliaClient } from "../core/algolia";

export const FOSTER_FAMILY_INDEX_NAME = "fosterFamily";

export const FosterFamilyIndex = AlgoliaClient.initIndex(
  FOSTER_FAMILY_INDEX_NAME
);

export type FosterFamilyFromAlgolia = Pick<FosterFamily, "displayName">;

export function getFormattedAddress(
  fosterFamily: Pick<FosterFamily, "address" | "zipCode" | "city">
) {
  return `${fosterFamily.address}, ${fosterFamily.zipCode} ${fosterFamily.city}`;
}

export function getShortLocation(
  fosterFamily: Pick<FosterFamily, "city" | "zipCode">
) {
  return `${fosterFamily.city} (${fosterFamily.zipCode.substring(0, 2)})`;
}
