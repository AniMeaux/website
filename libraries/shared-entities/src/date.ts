export function startOfUTCDay(date: Date): Date {
  date = new Date(date);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

// yyyy-mm-dd (2020-12-31)
export const DATE_PATTERN = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
