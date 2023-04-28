import { DateTime } from "luxon";

export function toIsoDateValue(date: undefined | null | string | Date) {
  if (date == null) {
    return "";
  }

  const dateTime =
    typeof date === "string"
      ? DateTime.fromISO(date)
      : DateTime.fromJSDate(date);

  return dateTime.toISODate();
}

export function toRoundedRelative(isoDate: string) {
  const date = DateTime.fromISO(isoDate);

  if (DateTime.now().minus({ minutes: 1 }) <= date) {
    return "il y a moins de 1 minute";
  }

  return date.toRelative();
}
