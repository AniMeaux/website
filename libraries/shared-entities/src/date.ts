import { differenceInMonths, format } from "date-fns";
import fr from "date-fns/locale/fr";

export function startOfUTCDay(date: Date): Date {
  date = new Date(date);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

// yyyy-mm-dd (2020-12-31)
export const DATE_PATTERN = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

// "6 mois"
// "1 an"
// "3 ans"
export function formatAge(birthday: string) {
  const ageInMonths = differenceInMonths(new Date(), new Date(birthday));

  if (ageInMonths >= 12) {
    const ageInYears = Math.floor(ageInMonths / 12);
    return ageInYears === 1 ? "1 an" : `${ageInYears} ans`;
  }

  return `${ageInMonths} mois`;
}

// "31/12/2020"
// See "Long localized date"
// https://date-fns.org/v2.17.0/docs/format
export function formatShortDate(date: string) {
  return format(new Date(date), "P", { locale: fr });
}

// "31 décembre 2020"
// See "Long localized date"
// https://date-fns.org/v2.17.0/docs/format
export function formatLongDate(date: string) {
  return format(new Date(date), "PPP", { locale: fr });
}
