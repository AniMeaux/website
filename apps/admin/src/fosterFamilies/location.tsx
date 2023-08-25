import type { FosterFamily } from "@prisma/client";

export function getShortLocation(
  fosterFamily: Pick<FosterFamily, "city" | "zipCode">
) {
  return `${fosterFamily.city} (${fosterFamily.zipCode.substring(0, 2)})`;
}

export function getLongLocation(
  fosterFamily: Pick<FosterFamily, "address" | "city" | "zipCode">
) {
  return `${fosterFamily.address}, ${fosterFamily.zipCode} ${fosterFamily.city}`;
}
