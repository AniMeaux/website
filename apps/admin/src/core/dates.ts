import { DateTime } from "luxon";

export function toIsoDateValue(
  date: undefined | null | string | Date,
  { hasTime = false }: { hasTime?: boolean } = {},
) {
  if (date == null) {
    return "";
  }

  const dateTime =
    typeof date === "string"
      ? DateTime.fromISO(date)
      : DateTime.fromJSDate(date);

  if (hasTime) {
    return dateTime.toISO().substring(0, 16);
  }

  return dateTime.toISODate();
}

export function toRoundedRelative(isoDate: string) {
  const date = DateTime.fromISO(isoDate);
  const now = DateTime.now();

  if (now.minus({ minutes: 1 }) <= date) {
    return "il y a moins de 1 minute";
  }

  if (now.minus({ days: 7 }) <= date) {
    return date.toRelative();
  }

  return date.toLocaleString({
    ...DateTime.DATE_MED,
    year: now.hasSame(date, "year") ? undefined : "numeric",
  });
}

export function startOfDay(date: undefined | Date) {
  if (date == null) {
    return undefined;
  }

  return DateTime.fromJSDate(date).startOf("day").toJSDate();
}

export function endOfDay(date: undefined | Date) {
  if (date == null) {
    return undefined;
  }

  return DateTime.fromJSDate(date).endOf("day").toJSDate();
}
