import { FosterFamily } from "@prisma/client";

export function getShortLocation(
  fosterFamily: Pick<FosterFamily, "city" | "zipCode">
) {
  return `${fosterFamily.city} (${fosterFamily.zipCode.substring(0, 2)})`;
}
