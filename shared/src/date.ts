import { DateTime } from "luxon";

// 6 mois
// 1 an
// 3 ans
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

export function formatDateRange(
  startDate: string,
  endDate: string,
  { showTime = false }: { showTime?: boolean } = {}
) {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);
  const now = DateTime.now();

  if (showTime) {
    // 2 avril, 09:00 - 19:00
    // 2 avril 2021, 09:00 - 19:00
    if (start.hasSame(end, "day")) {
      return [
        start.toLocaleString({
          day: "numeric",
          month: "long",
          year: start.hasSame(now, "year") ? undefined : "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
        "-",
        end.toLocaleString({ hour: "numeric", minute: "numeric" }),
      ].join(" ");
    }

    // 2 mars, 09:00 - 3 mars, 10:00
    // 2 mars, 09:00 - 3 avril, 10:00
    // 2 mars, 09:00 - 3 avril 2021, 10:00
    // 2 mars 2021, 09:00 - 3 avril 2022, 10:00
    return [
      start.toLocaleString({
        day: "numeric",
        month: "long",
        year: start.hasSame(end, "year") ? undefined : "numeric",
        hour: "numeric",
        minute: "numeric",
      }),
      "-",
      end.toLocaleString({
        day: "numeric",
        month: "long",
        year:
          start.hasSame(end, "year") && start.hasSame(now, "year")
            ? undefined
            : "numeric",
        hour: "numeric",
        minute: "numeric",
      }),
    ].join(" ");
  }

  // if (!showTime)
  if (start.hasSame(end, "day")) {
    // 2 avril
    // 2 avril 2021
    return start.toLocaleString({
      day: "numeric",
      month: "long",
      year: start.hasSame(now, "year") ? undefined : "numeric",
    });
  }

  // 2 - 3 avril
  // 2 - 3 avril 2021
  if (start.hasSame(end, "month")) {
    return [
      start.toLocaleString({ day: "numeric" }),
      "-",
      end.toLocaleString({
        day: "numeric",
        month: "long",
        year: start.hasSame(now, "year") ? undefined : "numeric",
      }),
    ].join(" ");
  }

  // 2 mars - 3 avril
  // 2 mars - 3 avril 2021
  if (start.hasSame(end, "year")) {
    return [
      start.toLocaleString({ day: "numeric", month: "long" }),
      "-",
      end.toLocaleString({
        day: "numeric",
        month: "long",
        year: start.hasSame(now, "year") ? undefined : "numeric",
      }),
    ].join(" ");
  }

  // 2 mars 2021 - 3 avril 2022
  return [
    start.toLocaleString({ day: "numeric", month: "long", year: "numeric" }),
    "-",
    end.toLocaleString({ day: "numeric", month: "long", year: "numeric" }),
  ].join(" ");
}
