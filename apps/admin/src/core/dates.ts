import { DateTime } from "luxon";

export function toIsoDateValue(date: null | Date) {
  if (date == null) {
    return "";
  }

  return DateTime.fromJSDate(date).toISODate();
}

export function toRoundedRelative(isoDate: string) {
  const date = DateTime.fromISO(isoDate);

  if (DateTime.now().minus({ minutes: 1 }) <= date) {
    return "il y a moins de 1 minute";
  }

  return date.toRelative();
}
