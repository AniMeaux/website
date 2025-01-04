import { DateTime } from "luxon";

export const PROFILE_EDITION_DEADLINE = DateTime.fromISO(
  "2025-05-07T00:00:00.000+02:00",
);

export function canEditProfile() {
  return DateTime.now() < PROFILE_EDITION_DEADLINE;
}
