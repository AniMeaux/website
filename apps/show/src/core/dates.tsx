import { DateTime } from "luxon";

export const OPENING_TIME = DateTime.fromISO("2024-06-08T10:00:00.000+02:00");
const CLOSING_TIME = DateTime.fromISO("2024-06-09T18:00:00.000+02:00");

export function hasShowEnded() {
  return DateTime.now() >= CLOSING_TIME;
}
