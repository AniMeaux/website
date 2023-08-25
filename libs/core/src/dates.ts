import { DateTime } from "luxon";

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
        start.toLocaleString(
          {
            day: "numeric",
            month: "long",
            year: start.hasSame(now, "year") ? undefined : "numeric",
            hour: "numeric",
            minute: "numeric",
          },
          { locale: "fr" }
        ),
        "-",
        end.toLocaleString(
          { hour: "numeric", minute: "numeric" },
          { locale: "fr" }
        ),
      ].join(" ");
    }

    // 2 mars, 09:00 - 3 mars, 10:00
    // 2 mars, 09:00 - 3 avril, 10:00
    // 2 mars, 09:00 - 3 avril 2021, 10:00
    // 2 mars 2021, 09:00 - 3 avril 2022, 10:00
    return [
      start.toLocaleString(
        {
          day: "numeric",
          month: "long",
          year: start.hasSame(end, "year") ? undefined : "numeric",
          hour: "numeric",
          minute: "numeric",
        },
        { locale: "fr" }
      ),
      "-",
      end.toLocaleString(
        {
          day: "numeric",
          month: "long",
          year:
            start.hasSame(end, "year") && start.hasSame(now, "year")
              ? undefined
              : "numeric",
          hour: "numeric",
          minute: "numeric",
        },
        { locale: "fr" }
      ),
    ].join(" ");
  }

  // if (!showTime)
  if (start.hasSame(end, "day")) {
    // 2 avril
    // 2 avril 2021
    return start.toLocaleString(
      {
        day: "numeric",
        month: "long",
        year: start.hasSame(now, "year") ? undefined : "numeric",
      },
      { locale: "fr" }
    );
  }

  // 2 - 3 avril
  // 2 - 3 avril 2021
  if (start.hasSame(end, "month")) {
    return [
      start.toLocaleString({ day: "numeric" }, { locale: "fr" }),
      "-",
      end.toLocaleString(
        {
          day: "numeric",
          month: "long",
          year: start.hasSame(now, "year") ? undefined : "numeric",
        },
        { locale: "fr" }
      ),
    ].join(" ");
  }

  // 2 mars - 3 avril
  // 2 mars - 3 avril 2021
  if (start.hasSame(end, "year")) {
    return [
      start.toLocaleString({ day: "numeric", month: "long" }, { locale: "fr" }),
      "-",
      end.toLocaleString(
        {
          day: "numeric",
          month: "long",
          year: start.hasSame(now, "year") ? undefined : "numeric",
        },
        { locale: "fr" }
      ),
    ].join(" ");
  }

  // 2 mars 2021 - 3 avril 2022
  return [
    start.toLocaleString(
      { day: "numeric", month: "long", year: "numeric" },
      { locale: "fr" }
    ),
    "-",
    end.toLocaleString(
      { day: "numeric", month: "long", year: "numeric" },
      { locale: "fr" }
    ),
  ].join(" ");
}
