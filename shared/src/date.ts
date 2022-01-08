import { DateTime } from "luxon";

// "6 mois"
// "1 an"
// "3 ans"
export function formatAge(birthday: string) {
  const ageInMonths = DateTime.now().diff(DateTime.fromISO(birthday), [
    "months",
  ]).months;

  if (ageInMonths >= 12) {
    const ageInYears = Math.floor(ageInMonths / 12);
    return ageInYears === 1 ? "1 an" : `${ageInYears} ans`;
  }

  return `${Math.floor(ageInMonths)} mois`;
}
