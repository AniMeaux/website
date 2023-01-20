import { DateTime } from "luxon";

export function toIsoDateValue(date: null | Date) {
  if (date == null) {
    return "";
  }

  return DateTime.fromJSDate(date).toISODate();
}
