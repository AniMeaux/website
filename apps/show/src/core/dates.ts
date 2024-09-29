import { DateTime } from "luxon";

export const OPENING_TIME = DateTime.fromISO("2025-06-07T10:00:00.000+02:00");
export const CLOSING_TIME = DateTime.fromISO("2025-06-08T18:00:00.000+02:00");

export function hasShowEnded() {
  return DateTime.now() >= CLOSING_TIME;
}

export enum ShowDay {
  SATURDAY = "samedi",
  SUNDAY = "dimanche",
}

export const SORTED_SHOW_DAYS = [ShowDay.SATURDAY, ShowDay.SUNDAY];
